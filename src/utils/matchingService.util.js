const { PrismaClient, MatchType } = require("@prisma/client");
const prisma = require("./prisma");

const matching = async (user) => {
  try {
    const matches = user.matches;
    const autoMatches = [];
    const manualMatches = [];
    const responseList = [];

    const profiles = await prisma.profile.findMany({
      where: {
        id: {
          in: matches.map((match) => match),
        },
      },
    });

    // Iterate through profiles
    for (const profile of profiles) {
      // Find the corresponding match for the current profile
      const correspondingMatch = profiles.find((p) => p.matches[0] === user.id);

      // Check if the current profile is the No.1 match for the user
      const isNo1MatchForUser = profile.matches[0] === user.id;

      // Check if the user is the No.1 match for the current profile
      const isUserNo1Match = user.matches[0] === profile.id;

      // Check if it's an automatch
      const isAutoMatch =
        isNo1MatchForUser && isUserNo1Match && correspondingMatch;

      // Check if it's a manual match
      const isManualMatch =
        !isAutoMatch &&
        user.matches.includes(profile.id) &&
        profile.matches.includes(user.id);

      // If it's an automatch, add the pair to autoMatches
      if (isAutoMatch) {
        autoMatches.push({
          profile1Id: profile.id,
          profile2Id: user.id,
          status: "AUTOMATCH",
        });
        responseList.push({
          profile1Id: profile.id,
          profile1picture: profile.profilePicture,
          profile2Id: user.id,
          profile2picture: user.profilePicture,
          status: "AUTOMATCH",
        });
      }

      // If it's a manual match, add the pair to manualMatches
      if (isManualMatch) {
        manualMatches.push({
          profile1Id: profile.id,
          profile2Id: user.id,
          status: "MANUALMATCH",
        });
        responseList.push({
          profile1Id: profile.id,
          profile1picture: profile.profilePicture,
          profile2Id: user.id,
          profile2picture: user.profilePicture,
          status: "MANUALMATCH",
        });
      }
    }

    console.log("Auto Matches:", autoMatches);
    console.log("Manual Matches:", manualMatches);
    await prisma.match.createMany({ data: [...autoMatches, ...manualMatches] });

    return { responseList };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  matching,
};
