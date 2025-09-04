const {
  createSeller: createSellerModel,
  findSellerById,
  updateSeller: updateSellerModel,
  deleteSeller: deleteSellerModel,
} = require("../models/sellers");

// 판매자 등록
async function createSeller(req, res, next) {
  try {
    const { user_id, sellerName } = req.body;
    const profileImage = req.file?.filename || null;

    const seller = await createSellerModel(
      req.pool,
      user_id,
      sellerName,
      profileImage
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
    const { sellerName } = req.body;
    const profileImage = req.file?.filename || null;

    const updates = {};
    if (sellerName) updates.seller_name = sellerName;
    if (profileImage) updates.profile_image = profileImage;

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
