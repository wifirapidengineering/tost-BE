const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedUserAndProfile = async () => {
  try {
    // Seed User and Profile tables
    for (let i = 0; i < 10; i++) {
      const user = await prisma.user.create({
        data: {
          firstName: `User${i}`,
          lastName: `Last${i}`,
          email: `user${i}@yahoo.com`,
          phone: `+1234569${i}`,
          password: `password${i}`,
          // Add other fields with appropriate values
        },
      });

      await prisma.profile.create({
        data: {
          userId: user.id,
          hobbies: ["SPORTS", "MUSIC"], // Add hobbies as per your enum
          bio: `Bio for User${i + 1}`,
          gender: "MALE", // Change gender as needed
          dateOfBirth: new Date(),
        },
      });

      console.log(`User and Profile seeded for user ${user.id}`);
    }

    console.log("User and Profile seeding completed.");
  } catch (error) {
    console.error("Error seeding User and Profile:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// seedUserAndProfile();

module.exports = { seedUserAndProfile };
