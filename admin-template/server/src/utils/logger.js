const { readJson, writeJson, getNextId } = require('./db');

const logAction = (user, action, target, req) => {
  try {
    const logs = readJson('logs.json');
    const newLog = {
      id: getNextId(logs),
      userId: user.id,
      username: user.username,
      action,
      target,
      time: new Date().toISOString(),
      ip: req.ip || '127.0.0.1'
    };
    logs.push(newLog);
    writeJson('logs.json', logs);
  } catch (error) {
    console.error('日志记录失败:', error);
  }
};

module.exports = { logAction };
