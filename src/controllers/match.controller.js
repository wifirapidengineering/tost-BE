const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { ResponseHandler } = require("../utils/responseHandler");
const {
  performAutoMatching,
  performManualMatching,
} = require("../utils/matchingService.util");

const updateOrderedProfiles = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { orderedProfiles } = req.body; //list of 4 profileIds

    // upsert the ordered profiles
    const user = await prisma.profile.upsert({
      where: { userId: profileId },
      update: { orderedProfiles: { set: orderedProfiles } },
      create: { userId: profileId, orderedProfiles },
    });

    // Perform auto-matching
    const autoMatches = await performAutoMatching(profileId, orderedProfiles);

    // Perform manual matching
    const manualMatches = await performManualMatching(
      profileId,
      orderedProfiles
    );

    ResponseHandler.success(
      res,
      { orderedProfiles, autoMatches, manualMatches },
      200,
      "Ordered profiles updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateOrderedProfiles,
};
