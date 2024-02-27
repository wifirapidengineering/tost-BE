const prisma = require("../utils/prisma");
const checkRequiredFields = require("../utils/requiredFieldsChecker");
const { ResponseHandler } = require("../utils/responseHandler");
const { BadRequestError } = require("../middlewares/errorhandler.middleware");
const { uploadToCloudinary } = require("../utils/imageUploadService");

const createProfile = async (req, res, next) => {
  try {
    const {
      gender,
      dob,
      hobbies,
      bio,
      longitude,
      latitude,
      city,
      state,
      country,
      range,
    } = req.body;
    const userId = req.params.userId;

    await checkRequiredFields(req.body, {
      gender: "Gender",
      dob: "Date of Birth",
      bio: "Bio",
    });

    const location = {
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      city,
      state,
      country,
      range: parseInt(range),
    };

    // Upload photos to Cloudinary
    if (!req.files || req.files.length === 0) {
      throw new BadRequestError("No photos uploaded");
    }

    const uploadedPhotoUrls = await uploadToCloudinary(req.files);

    // Create or update profile in the database
    const profile = await prisma.profile.upsert({
      where: { userId: userId },
      update: {
        gender,
        dateOfBirth: dob ? new Date(dob) : undefined,
        hobbies: hobbies?.split(","),
        gallery: {
          create: uploadedPhotoUrls.urls?.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
        bio,
        location: { update: location },
        userId: userId,
      },
      create: {
        gender,
        dateOfBirth: new Date(dob),
        hobbies: hobbies?.split(","),
        gallery: {
          create: uploadedPhotoUrls.urls?.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
        bio,
        location: { create: location },
        userId: userId,
      },
    });

    ResponseHandler.success(res, profile, 201, "Profile created successfully");
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        gallery: true,
        location: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            isArchived: true,
            isVerified: true,
          },
        },
      },
    });

    if (!profile) {
      throw new BadRequestError("Profile not found");
    }

    ResponseHandler.success(
      res,
      profile,
      200,
      "Profile retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const {
      gender,
      dob,
      hobbies,
      bio,
      longitude,
      latitude,
      city,
      state,
      country,
      range,
    } = req.body;
    let uploadedPhotoUrls = [];

    if (!gender && !dob && !hobbies && !bio && !req.files) {
      throw new BadRequestError("At least one required field is missing");
    }

    if (req.files?.length > 0) {
      uploadedPhotoUrls = await uploadToCloudinary(req.files);
    }

    const location = {
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      city,
      state,
      country,
      range: parseInt(range),
    };

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: { gallery: true },
    });

    if (!profile) {
      throw new BadRequestError("Profile not found");
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: userId },
      include: {
        location: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            isArchived: true,
            isVerified: true,
          },
        },
      },
      data: {
        gender,
        dateOfBirth: dob ? new Date(dob) : undefined,
        hobbies: hobbies?.split(","),
        gallery: {
          create: uploadedPhotoUrls.urls?.map((photo) => ({
            url: photo.url,
            publicId: photo.publicId,
          })),
        },
        bio,
        location: { update: location },
        userId: userId,
      },
    });

    ResponseHandler.success(
      res,
      updatedProfile,
      200,
      "Profile updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { createProfile, getProfile, updateProfile };
