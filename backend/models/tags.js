async function getAllTags(pool) {
  const [rows] = await pool.query(`
    SELECT tag_id AS id, tag_name AS name FROM tags
  `);
  return rows;
}

async function createTag(pool, name) {
  const [result] = await pool.query(`INSERT INTO tags (tag_name) VALUES (?)`, [
    name,
  ]);
  return result.insertId;
}

async function updateTag(pool, tagId, name) {
  const [result] = await pool.query(
    `UPDATE tags SET tag_name = ? WHERE tag_id = ?`,
    [name, tagId]
  );
  return result.affectedRows;
}

async function deleteTag(pool, tagId) {
  const [result] = await pool.query(`DELETE FROM tags WHERE tag_id = ?`, [
    tagId,
  ]);
  return result.affectedRows;
}

module.exports = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
};
