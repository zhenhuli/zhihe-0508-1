import { createHash } from 'crypto';

export function hashPassword(password: string): string {
  const salt = 'collab-note-salt-2024';
  const hash = createHash('sha256')
    .update(salt + password)
    .digest('hex');
  return hash;
}

export function verifyPassword(password: string, hash: string): boolean {
  const expectedHash = hashPassword(password);
  return expectedHash === hash;
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少为6个字符' };
  }
  return { valid: true };
}

export function validateUsername(username: string): { valid: boolean; message?: string } {
  if (username.length < 3) {
    return { valid: false, message: '用户名长度至少为3个字符' };
  }
  if (username.length > 20) {
    return { valid: false, message: '用户名长度不能超过20个字符' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: '用户名只能包含字母、数字和下划线' };
  }
  return { valid: true };
}
