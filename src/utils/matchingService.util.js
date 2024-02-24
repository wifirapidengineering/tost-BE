const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const performAutoMatching = async (profileId) => {
  try {
    const user = await prisma.profile.findUnique({
      where: { profileId },
      include: {
        matches,
      },
    });

    const autoMatches = [];
    const profiles = await prisma.profile.findMany({
      where: {
        profileId: {
          in: user.matches.map((match) => match),
        },
        include: {
          matches,
        },
      },
    });

    if (user.matches[0].id === profiles[0].matches.id) {
      autoMatches.push({
        user1Id: user.profileId,
        user2Id: profiles[0].profileId,
      });
    }
    return autoMatches;
  } catch (error) {
    throw error;
  }
};

const performManualMatching = async (userId, orderedProfiles) => {
  try {
    const manualMatches = [];

    // Check if the user's ordered profiles match with others manually
    const otherUsers = await prisma.match.findMany({
      where: {
        user2Id: userId,
        orderedProfiles: { contains: orderedProfiles[0] }, // Check if the user is in the top position
      },
    });

    for (const otherUser of otherUsers) {
      const commonProfiles = orderedProfiles.filter((profile) =>
        otherUser.orderedProfiles.includes(profile)
      );

      if (
        commonProfiles.length >= 2 &&
        otherUser.orderedProfiles[0] === userId
      ) {
        manualMatches.push({ user1Id: otherUser.user1Id, user2Id: userId });
      }
    }

    return manualMatches;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  performAutoMatching,
  performManualMatching,
};
