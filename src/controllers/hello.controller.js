const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const helloController = async (req, res) => {
  const { PrismaClient } = require("@prisma/client");

  const prisma = new PrismaClient();

  async function updateRandomUsersLocations() {
    try {
      // Get random 20 user profiles
      const randomProfiles = await prisma.profile.findMany({
        take: 20,
        orderBy: {
          createdAt: "asc", // Or any other criteria you want for randomness
        },
      });

      // Coordinates to update
      const coordinates = [
        { latitude: 9.017744, longitude: 7.401204 },
        { latitude: 9.043687, longitude: 7.409624 },
        { latitude: 8.97093, longitude: 7.439245 },
        { latitude: 9.073727, longitude: 7.471095 },
        { latitude: 9.075653, longitude: 7.472235 },
        { latitude: 9.076545, longitude: 7.4729 },
        { latitude: 9.072779, longitude: 7.466876 },
        { latitude: 8.992205, longitude: 7.433507 },
        { latitude: 8.985198, longitude: 7.417758 },
        { latitude: 8.979348, longitude: 7.463205 },
        { latitude: 8.983059, longitude: 7.417132 },
        { latitude: 8.981083, longitude: 7.418382 },
        { latitude: 8.980507, longitude: 7.418049 },
        { latitude: 8.98049, longitude: 7.416265 },
        { latitude: 8.985562, longitude: 7.419266 },
        { latitude: 8.988696, longitude: 7.418044 },
        { latitude: 8.998262, longitude: 7.422771 },
        { latitude: 9.001522, longitude: 7.423121 },
        { latitude: 9.011296, longitude: 7.415159 },
        { latitude: 9.005054, longitude: 7.404011 },
      ];

      // Update the location for each random profile
      for (let i = 0; i < randomProfiles.length; i++) {
        const profile = randomProfiles[i];
        const { latitude, longitude } = coordinates[i];

        console.log("LOG", profile.userId, latitude, longitude);

        try {
          // Update the location through the Profile model
          await prisma.profile.update({
            where: { userId: profile.userId },
            data: {
              location: {
                upsert: {
                  create: { latitude, longitude },
                  update: { latitude, longitude },
                },
              },
            },
          });

          console.log(`Location updated for user ${profile.userId}`);
        } catch (updateError) {
          console.error(
            `Error updating location for user ${profile.userId}:`,
            updateError
          );
        }
      }

      console.log("Update completed.");
    } catch (error) {
      console.error("Error updating locations:", error);
    } finally {
      await prisma.$disconnect();
    }
  }

  // Run the update script
  updateRandomUsersLocations();
};

module.exports = { helloController };
