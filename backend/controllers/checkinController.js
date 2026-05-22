const pool = require('../db');

// 체크인
exports.checkin = async (req, res) => {
  const { petId } = req.body;
  const userId = req.user.userId;

  if (!petId) {
    return res.status(400).json({
      success: false,
      message: '반려견을 선택해주세요.',
    });
  }

  try {
    const [activeCheckin] = await pool.query(
      `SELECT *
       FROM pet_checkin
       WHERE pet_id = ? AND status = 'checked_in'`,
      [petId]
    );

    if (activeCheckin.length > 0) {
      return res.status(400).json({
        success: false,
        message: '이미 체크인된 반려견입니다.',
      });
    }

    const [result] = await pool.query(
      `INSERT INTO pet_checkin (pet_id, user_id, checkin_time, status)
       VALUES (?, ?, NOW(), 'checked_in')`,
      [petId, userId]
    );

    return res.status(201).json({
      success: true,
      message: '체크인이 완료되었습니다.',
      checkinId: result.insertId,
    });
  } catch (error) {
    console.error('체크인 오류:', error);
    return res.status(500).json({
      success: false,
      message: '체크인 처리 중 서버 오류가 발생했습니다.',
    });
  }
};

// 체크아웃
exports.checkout = async (req, res) => {
  const { petId } = req.body;
  const userId = req.user.userId;

  if (!petId) {
    return res.status(400).json({
      success: false,
      message: '반려견 정보가 필요합니다.',
    });
  }

  try {
    const [activeCheckin] = await pool.query(
      `SELECT *
       FROM pet_checkin
       WHERE pet_id = ? AND user_id = ? AND status = 'checked_in'`,
      [petId, userId]
    );

    if (activeCheckin.length === 0) {
      return res.status(400).json({
        success: false,
        message: '현재 체크인된 기록이 없습니다.',
      });
    }

    await pool.query(
      `UPDATE pet_checkin
       SET checkout_time = NOW(), status = 'checked_out'
       WHERE checkin_id = ?`,
      [activeCheckin[0].checkin_id]
    );

    return res.status(200).json({
      success: true,
      message: '체크아웃이 완료되었습니다.',
    });
  } catch (error) {
    console.error('체크아웃 오류:', error);
    return res.status(500).json({
      success: false,
      message: '체크아웃 처리 중 서버 오류가 발생했습니다.',
    });
  }
};

// 특정 반려견 체크인 상태 조회
exports.getCheckinStatus = async (req, res) => {
  const { petId } = req.params;
  const userId = req.user.userId;

  try {
    const [status] = await pool.query(
      `SELECT *
       FROM pet_checkin
       WHERE pet_id = ? AND user_id = ? AND status = 'checked_in'
       ORDER BY checkin_time DESC
       LIMIT 1`,
      [petId, userId]
    );

    return res.status(200).json({
      success: true,
      isCheckedIn: status.length > 0,
      data: status.length > 0 ? status[0] : null,
    });
  } catch (error) {
    console.error('체크인 상태 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '체크인 상태 조회 중 서버 오류가 발생했습니다.',
    });
  }
};

// 내 체크인/체크아웃 기록 조회
exports.getMyCheckRecords = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [records] = await pool.query(
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
          p.description AS registration_number
       FROM pet_checkin pc
       JOIN pet p ON pc.pet_id = p.id
       WHERE pc.user_id = ?
       ORDER BY pc.checkin_time DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: '내 이용 기록 조회 성공',
      data: {
        records,
      },
    });
  } catch (error) {
    console.error('내 이용 기록 조회 오류:', error);
    return res.status(500).json({
      success: false,
      message: '내 이용 기록 조회 중 서버 오류가 발생했습니다.',
    });
  }
};
