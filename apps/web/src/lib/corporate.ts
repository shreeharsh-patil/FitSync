"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getOrganizationBySlug(slug: string) {
  try {
    return await db.organization.findUnique({
      where: { slug },
      include: {
        teams: true,
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            team: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getOrganizationById(orgId: string) {
  try {
    return await db.organization.findUnique({
      where: { id: orgId },
      include: {
        teams: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, email: true, image: true, activityLevel: true } },
              },
            },
          },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true, activityLevel: true } },
            team: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getTeams(orgId: string) {
  try {
    return await db.team.findMany({
      where: { orgId },
      include: {
        _count: { select: { members: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export async function createTeam(orgId: string, name: string, description?: string) {
  try {
    const team = await db.team.create({
      data: { orgId, name, description },
    });
    revalidatePath("/corporate/teams");
    return { success: true, team };
  } catch (error) {
    console.error("Create team error:", error);
    return { error: "Failed to create team" };
  }
}

export async function joinTeam(teamId: string, userId: string) {
  try {
    const team = await db.team.findUnique({ where: { id: teamId } });
    if (!team) return { error: "Team not found" };

    const existing = await db.orgMember.findFirst({
      where: { userId, teamId },
    });
    if (existing) return { error: "Already a member of this team" };

    await db.orgMember.updateMany({
      where: { userId, orgId: team.orgId },
      data: { teamId },
    });

    revalidatePath("/corporate/teams");
    return { success: true };
  } catch (error) {
    console.error("Join team error:", error);
    return { error: "Failed to join team" };
  }
}

export async function leaveTeam(userId: string) {
  try {
    await db.orgMember.updateMany({
      where: { userId, teamId: { not: null } },
      data: { teamId: null },
    });
    revalidatePath("/corporate/teams");
    return { success: true };
  } catch (error) {
    console.error("Leave team error:", error);
    return { error: "Failed to leave team" };
  }
}

export async function getWellnessScore(userId: string) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const workoutLogs = await db.workoutLog.findMany({
      where: { userId, logDate: { gte: thirtyDaysAgo } },
    });

    const nutritionLogs = await db.nutritionLog.findMany({
      where: { userId, logDate: { gte: thirtyDaysAgo } },
    });

    const workoutDays = new Set(
      workoutLogs.map((l) => l.logDate.toISOString().split("T")[0])
    ).size;

    const avgCalories = nutritionLogs.length
      ? nutritionLogs.reduce((s, l) => s + l.totalCalories, 0) / nutritionLogs.length
      : 0;

    const totalWater = nutritionLogs.reduce((s, l) => s + l.waterMl, 0);

    const workoutScore = Math.min((workoutDays / 12) * 100, 100);
    const nutritionScore = avgCalories > 0 && avgCalories < 4000 ? 80 : 50;
    const hydrationScore = Math.min((totalWater / (30 * 2000)) * 100, 100);
    const consistencyScore = workoutLogs.length > 0
      ? Math.min((workoutLogs.length / 15) * 100, 100)
      : 0;

    const overall = Math.round(
      (workoutScore * 0.35 + nutritionScore * 0.3 + hydrationScore * 0.15 + consistencyScore * 0.2)
    );

    return {
      overall,
      workoutScore: Math.round(workoutScore),
      nutritionScore: Math.round(nutritionScore),
      hydrationScore: Math.round(hydrationScore),
      consistencyScore: Math.round(consistencyScore),
      workoutDays,
      avgCalories: Math.round(avgCalories),
    };
  } catch {
    return null;
  }
}

export async function getCorporateDashboard(orgId: string) {
  try {
    const org = await getOrganizationById(orgId);
    if (!org) return null;

    const memberScores = await Promise.all(
      org.members.map(async (m) => {
        const score = await getWellnessScore(m.userId);
        return {
          member: m,
          score,
        };
      })
    );

    const teamScores = org.teams.map((team) => {
      const teamMembers = memberScores.filter((ms) => ms.member.teamId === team.id);
      const avgScore = teamMembers.length
        ? Math.round(teamMembers.reduce((s, ms) => s + (ms.score?.overall || 0), 0) / teamMembers.length)
        : 0;
      return {
        team,
        avgScore,
        memberCount: teamMembers.length,
      };
    });

    const allOverall = memberScores
      .map((ms) => ms.score?.overall)
      .filter((s): s is number => s !== undefined && s !== null);

    const companyAvgScore = allOverall.length
      ? Math.round(allOverall.reduce((a, b) => a + b, 0) / allOverall.length)
      : 0;

    const sortedMembers = [...memberScores]
      .filter((ms) => ms.score)
      .sort((a, b) => (b.score?.overall || 0) - (a.score?.overall || 0));

    const sortedTeams = [...teamScores].sort((a, b) => b.avgScore - a.avgScore);

    return {
      org,
      companyAvgScore,
      memberScores: sortedMembers,
      teamScores: sortedTeams,
      totalMembers: org.members.length,
      totalTeams: org.teams.length,
    };
  } catch (error) {
    console.error("Corporate dashboard error:", error);
    return null;
  }
}

export async function getDepartmentLeaderboard(orgId: string) {
  try {
    const teams = await db.team.findMany({
      where: { orgId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    const leaderboard = await Promise.all(
      teams.map(async (team) => {
        const scores = await Promise.all(
          team.members.map(async (m) => {
            const score = await getWellnessScore(m.userId);
            return { name: m.user.name || "Unknown", score: score?.overall || 0 };
          })
        );
        const avgScore = scores.length
          ? Math.round(scores.reduce((s, ms) => s + ms.score, 0) / scores.length)
          : 0;
        return {
          teamName: team.name,
          avgScore,
          members: scores.sort((a, b) => b.score - a.score),
        };
      })
    );

    return leaderboard.sort((a, b) => b.avgScore - a.avgScore);
  } catch {
    return [];
  }
}
