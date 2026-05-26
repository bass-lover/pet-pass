<<<<<<< HEAD
// 注意：把这里改成你项目里实际的数据库连接文件路径！
const db = require('../config/db'); 
=======
const pool = require('../db');
>>>>>>> 1e5e20b77656b6c176f952b77ae8e715cb8ba22b

// 현재 입장 중인 반려견 수 및 목록 조회
exports.getCurrentPets = async (req, res) => {
  try {
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS current_pet_count
       FROM pet_checkin
       WHERE status = 'checked_in'`
    );

    const [currentPets] = await pool.query(
      `SELECT 
          pc.checkin_id,
          pc.pet_id,
          pc.user_id,
          pc.checkin_time,
          pc.checkout_time,
          pc.status,
          p.pet_name,
          p.type,
          p.age,
          p.description AS registration_number,
          u.username
       FROM pet_checkin pc
       JOIN pet p ON pc.pet_id = p.id
       JOIN user u ON pc.user_id = u.id
       WHERE pc.status = 'checked_in'
       ORDER BY pc.checkin_time DESC`
    );

    return res.status(200).json({
      success: true,
      message: '현재 이용 현황 조회 성공',
      data: {
        current_pet_count: countRows[0].current_pet_count,
        current_pets: currentPets,
      },
    });
  } catch (error) {
    console.error('현재 이용 현황 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '현재 이용 현황 조회 중 서버 오류가 발생했습니다.',
    });
  }
};

// 전체 체크인/체크아웃 기록 조회
exports.getCheckRecords = async (req, res) => {
  try {
    const [records] = await pool.query(
      `SELECT 
          pc.checkin_id,
          pc.pet_id,
          pc.user_id,
          pc.checkin_time,
          pc.checkout_time,
          pc.status,
          pc.created_at,
          pc.updated_at,
          p.pet_name,
          p.type,
          p.age,
          p.description AS registration_number,
          u.username
       FROM pet_checkin pc
       JOIN pet p ON pc.pet_id = p.id
       JOIN user u ON pc.user_id = u.id
       ORDER BY pc.checkin_time DESC`
    );

    return res.status(200).json({
      success: true,
      message: '출입 기록 조회 성공',
      data: {
        records,
      },
    });
  } catch (error) {
    console.error('출입 기록 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '출입 기록 조회 중 서버 오류가 발생했습니다.',
    });
  }
};
