// 敏感词列表（示例，实际应该更完善）
const SENSITIVE_WORDS = [
  '色情', '淫秽', '赌博', '毒品', '暴力', '恐怖',
  '反动', '政治', '法轮功', '六四', '习近平',
  // 可以根据需要添加更多敏感词
]

// XSS危险字符
const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<img[^>]*onerror/gi,
]

// SQL注入模式
const SQL_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
  /(--|;|\/\*|\*\/|xp_|sp_)/gi,
  /(\bOR\b.*=.*|1=1|'=')/gi,
]

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateContent(content: string): ValidationResult {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: '内容不能为空' }
  }

  // 长度限制
  if (content.length > 5000) {
    return { isValid: false, error: '内容过长，请控制在5000字以内' }
  }

  // 敏感词检测
  for (const word of SENSITIVE_WORDS) {
    if (content.includes(word)) {
      return { isValid: false, error: '内容包含敏感词，请修改后重试' }
    }
  }

  // XSS检测
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(content)) {
      return { isValid: false, error: '内容包含非法字符，请检查输入' }
    }
  }

  // SQL注入检测
  for (const pattern of SQL_PATTERNS) {
    if (pattern.test(content)) {
      return { isValid: false, error: '内容格式不正确，请检查输入' }
    }
  }

  // JSON注入检测
  const jsonPatterns = [/\{.*".*:.*\}/g, /\[.*\]/g]
  let jsonCount = 0
  for (const pattern of jsonPatterns) {
    const matches = content.match(pattern)
    if (matches) jsonCount += matches.length
  }
  if (jsonCount > 3) {
    return { isValid: false, error: '内容格式异常，请检查输入' }
  }

  return { isValid: true }
}

// 清理内容
export function sanitizeContent(content: string): string {
  return content
    .replace(/<[^>]*>/g, '') // 移除HTML标签
    .replace(/[<>'"]/g, '') // 移除特殊字符
    .trim()
}
