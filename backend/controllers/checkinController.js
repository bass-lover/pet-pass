const pool = require('../db');

// 签到
exports.checkin = async (req, res) => {
    const { petId } = req.body;
    const userId = 1; // 直接写死用户ID，跳过验证

    try {
        const [activeCheckin] = await pool.query(
            `SELECT * FROM pet_checkin WHERE pet_id = ? AND status = 'checked_in'`,
            [petId]
        );

        if (activeCheckin.length > 0) {
            return res.status(400).json({
                success: false,
                message: "该宠物当前已签到，无需重复签到"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO pet_checkin (pet_id, user_id, checkin_time, status) 
             VALUES (?, ?, NOW(), 'checked_in')`,
            [petId, userId]
        );

        res.status(201).json({
            success: true,
            message: "签到成功",
            checkinId: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "服务器错误"
        });
    }
};

// 签退
exports.checkout = async (req, res) => {
    const { petId } = req.body;
    const userId = req.user.userId; // 同样写死用户ID

    try {
        const [activeCheckin] = await pool.query(
            `SELECT * FROM pet_checkin WHERE pet_id = ? AND user_id = ? AND status = 'checked_in'`,
            [petId, userId]
        );

        if (activeCheckin.length === 0) {
            return res.status(400).json({
                success: false,
                message: "该宠物当前未签到，无法签退"
            });
        }

        await pool.query(
            `UPDATE pet_checkin SET checkout_time = NOW(), status = 'checked_out' WHERE checkin_id = ?`,
            [activeCheckin[0].checkin_id]
        );

        res.status(200).json({
            success: true,
            message: "签退成功"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "服务器错误"
        });
    }
};

// 签到状态查询
exports.getCheckinStatus = async (req, res) => {
    const { petId } = req.params;

    try {
        const [status] = await pool.query(
            `SELECT status FROM pet_checkin WHERE pet_id = ? AND status = 'checked_in'`,
            [petId]
        );

        res.status(200).json({
            success: true,
            isCheckedIn: status.length > 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "服务器错误"
        });
    }
};