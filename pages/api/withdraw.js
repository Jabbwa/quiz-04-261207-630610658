export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    // return res.status(403).json({ ok: false, message: "You do not have permission to deposit" });
    if (user.isAdmin)
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to deposit",
      });
    //return res.status(403).json({ ok: false, message: "You do not have permission to withdraw" });

    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });
    if (amount < 1)
      return res
        .status(400)
        .json({ ok: false, message: "Amount must be greater than 0" });

    //find and update money in DB (if user has enough money)
    const users = readUsersDB();
    const usersIdx = users.findIndex((x) => x.usermane === user.username);
    if (users[usersIdx].money - amount >= 0) {
      users[usersIdx].money = users[usersIdx].money - amount;
    } else
      return res
        .status(400)
        .json({ ok: false, message: "You do not has enough money" });

    writeUsersDB(users);
    //return response
    return res.json({ ok: true, money: users[users].money });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
