// 注意：把这里改成你项目里实际的数据库连接文件路径！
const db = require('../config/db'); 

// 현재 이용자(반려견) 수 조회 / 查询当前在园宠物数量
exports.getCurrentPets = async (req, res) => {
  try {
    // 1. 查询状态为checked_in的宠物总数
    const [countResult] = await db.query(
      'SELECT COUNT(*) AS total FROM pet WHERE status = "checked_in"'
    );

    // 2. 查询在园宠物列表（适配你的users表字段：用nickname、关联u.id）
    const [petsResult] = await db.query(`
      SELECT 
        p.id AS pet_id, 
        p.pet_name AS name, 
        u.nickname AS owner_name 
      FROM pet p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.status = "checked_in"
    `);

    // 3. 返回结果
    res.status(200).json({
      success: true,
      data: {
        current_pet_count: countResult[0].total,
        current_pets: petsResult
      }
    });
  } catch (error) {
    console.error('현재 이용자 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};

// 관리자 기록 조회 / 查询管理员签到/签退记录
exports.getCheckRecords = async (req, res) => {
  try {
    const { pet_id, status, start_date, end_date, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // 适配你的表：用 u.nickname 代替 u.username，关联 u.id
    let sql = `
      SELECT 
        pc.checkin_id AS record_id, 
        pc.pet_id, 
        p.pet_name AS pet_name, 
        pc.status AS check_type, 
        pc.checkin_time AS check_time, 
        u.nickname AS owner_name
      FROM pet_checkin pc
      JOIN pet p ON pc.pet_id = p.id
      JOIN users u ON pc.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // 动态添加筛选条件
    if (pet_id) {
      sql += ' AND pc.pet_id = ?';
      params.push(pet_id);
    }
    if (status) {
      sql += ' AND pc.status = ?';
      params.push(status);
    }
    if (start_date && end_date) {
      sql += ' AND pc.checkin_time BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    // 分页处理
    sql += ' ORDER BY pc.checkin_time DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    // 执行查询
    const [records] = await db.query(sql, params);

    // 统计总数（和查询条件完全一致）
    let countSql = `
      SELECT COUNT(*) AS total FROM pet_checkin pc
      JOIN pet p ON pc.pet_id = p.id
      JOIN users u ON pc.user_id = u.id
      WHERE 1=1
    `;
    const countParams = [];

    if (pet_id) {
      countSql += ' AND pc.pet_id = ?';
      countParams.push(pet_id);
    }
    if (status) {
      countSql += ' AND pc.status = ?';
      countParams.push(status);
    }
    if (start_date && end_date) {
      countSql += ' AND pc.checkin_time BETWEEN ? AND ?';
      countParams.push(start_date, end_date);
    }

    const [totalResult] = await db.query(countSql, countParams);

    res.status(200).json({
      success: true,
      data: {
        total_records: totalResult[0].total,
        current_page: parseInt(page),
        total_pages: Math.ceil(totalResult[0].total / limit),
        records: records
      }
    });
  } catch (error) {
    console.error('기록 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
};