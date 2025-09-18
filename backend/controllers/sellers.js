const fs = require("fs");
const { uploadToS3 } = require("../Images/S3");
const {
  createSeller: createSellerModel,
  findSellerById,
  updateSeller: updateSellerModel,
  deleteSeller: deleteSellerModel,
} = require("../models/sellers");

// 판매자 등록
async function createSeller(req, res, next) {
  try {
    const { seller_name } = req.body;
    const user_id = req.user.user_id;

    let profileImageUrl = null;
    if (req.file) {
      profileImageUrl = await uploadToS3(
        req.file.path,
        `seller-profile-images/${req.file.filename}`,
        req.file.mimetype
      );
      fs.unlinkSync(req.file.path);
    }

    const seller = await createSellerModel(
      req.pool,
      user_id,
      seller_name,
      profileImageUrl
    );

    res.status(201).json({ message: "판매자 등록 성공", seller });
  } catch (error) {
    next(error);
  }
}

// 판매자 조회
async function getSellerById(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const seller = await findSellerById(req.pool, id);
    if (!seller) {
      return res.status(404).json({ message: "판매자를 찾을 수 없습니다." });
    }
    res.json(seller);
  } catch (error) {
    next(error);
  }
}

// 판매자 정보 수정
async function updateSeller(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { seller_name } = req.body;

    const updates = {};
    if (seller_name) updates.seller_name = seller_name;

    if (req.file) {
      const profileImageUrl = await uploadToS3(
        req.file.path,
        `seller-profile-images/${req.file.filename}`,
        req.file.mimetype
      );
      fs.unlinkSync(req.file.path);
      updates.profile_image = profileImageUrl;
    }

    const updatedSeller = await updateSellerModel(req.pool, id, updates);

    if (!updatedSeller) {
      return res.status(404).json({ message: "판매자를 찾을 수 없습니다." });
    }
    res.json({ message: "판매자 정보 수정 완료", updatedSeller });
  } catch (error) {
    next(error);
  }
}

// 판매자 삭제
async function deleteSeller(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const deleted = await deleteSellerModel(req.pool, id);
    if (!deleted) {
      return res.status(404).json({ message: "판매자를 찾을 수 없습니다." });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSeller,
  getSellerById,
  updateSeller,
  deleteSeller,
};
