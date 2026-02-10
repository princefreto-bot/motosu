// GET /api/admin/global-stats - Stats publiques
router.get('/global-stats', async (req, res) => {
  try {
    const approvedWithdrawals = await Withdrawal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalEarningsResult = await User.aggregate([
       { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
    ]);

    res.json({
      totalPaid: approvedWithdrawals[0]?.total || 0,
      totalEarnings: totalEarningsResult[0]?.total || 0
    });
  } catch (error) {
    res.json({ totalPaid: 0, totalEarnings: 0 });
  }
});
