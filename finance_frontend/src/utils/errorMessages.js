const exactMessages = new Map([
  ['Invalid username!', 'Tên đăng nhập không hợp lệ'],
  ['Username not found and/or password incorrect', 'Tên đăng nhập hoặc mật khẩu không đúng'],
  ['Stock not found', 'Không tìm thấy cổ phiếu'],
  ['Cannot add same stock to portfolio', 'Cổ phiếu này đã có trong danh mục'],
  ['Stock not in your portfolio', 'Cổ phiếu không có trong danh mục của bạn'],
  ['Stock does not exist', 'Cổ phiếu không tồn tại'],
  ['Title cannot be empty', 'Tiêu đề không được để trống'],
  ['Title cannot be over 500 charactors', 'Tiêu đề không được vượt quá 500 ký tự'],
  ['Symbol must be 1 character!', 'Symbol phải có ít nhất 1 ký tự'],
  ["Symbol can't be over 10 charactors", 'Symbol không được vượt quá 10 ký tự'],
  ['Company name is required!', 'Tên công ty là bắt buộc'],
  ["Company name can't be over 300 charactors", 'Tên công ty không được vượt quá 300 ký tự'],
  ['Purchase is not valid', 'Giá mua không hợp lệ'],
  ['The Username field is required.', 'Tên đăng nhập là bắt buộc'],
  ['The Password field is required.', 'Mật khẩu là bắt buộc'],
  ['The Email field is required.', 'Email là bắt buộc'],
  ['The Email field is not a valid e-mail address.', 'Email không hợp lệ'],
  ['The Symbol field is required.', 'Symbol là bắt buộc'],
  ['The CompanyName field is required.', 'Tên công ty là bắt buộc'],
  ['The Industry field is required.', 'Ngành là bắt buộc'],
  ['The Title field is required.', 'Tiêu đề là bắt buộc'],
  ['The Content field is required.', 'Nội dung là bắt buộc'],
])

const fieldNames = new Map([
  ['Username', 'Tên đăng nhập'],
  ['UserName', 'Tên đăng nhập'],
  ['Password', 'Mật khẩu'],
  ['Email', 'Email'],
  ['Symbol', 'Symbol'],
  ['CompanyName', 'Tên công ty'],
  ['Company name', 'Tên công ty'],
  ['Industry', 'Ngành'],
  ['Purchase', 'Giá mua'],
  ['LastDiv', 'Cổ tức gần nhất'],
  ['MarketCap', 'Market cap'],
  ['Title', 'Tiêu đề'],
  ['Content', 'Nội dung'],
])

const patternMessages = [
  {
    pattern: /^Passwords must be at least (\d+) characters\.$/,
    translate: ([, length]) => `Mật khẩu phải có ít nhất ${length} ký tự.`,
  },
  {
    pattern: /^Passwords must have at least one non alphanumeric character\.$/,
    translate: () => 'Mật khẩu phải có ít nhất một ký tự đặc biệt.',
  },
  {
    pattern: /^Passwords must have at least one lowercase \('a'-'z'\)\.$/,
    translate: () => 'Mật khẩu phải có ít nhất một chữ thường.',
  },
  {
    pattern: /^Passwords must have at least one uppercase \('A'-'Z'\)\.$/,
    translate: () => 'Mật khẩu phải có ít nhất một chữ hoa.',
  },
  {
    pattern: /^Passwords must have at least one digit \('0'-'9'\)\.$/,
    translate: () => 'Mật khẩu phải có ít nhất một chữ số.',
  },
  {
    pattern: /^Username '(.+)' is already taken\.$/,
    translate: ([, username]) => `Tên đăng nhập "${username}" đã được sử dụng.`,
  },
  {
    pattern: /^Email '(.+)' is already taken\.$/,
    translate: ([, email]) => `Email "${email}" đã được sử dụng.`,
  },
  {
    pattern: /^Invalid Email '(.+)'\.$/,
    translate: ([, email]) => `Email "${email}" không hợp lệ.`,
  },
  {
    pattern: /^User name '(.+)' is invalid, can only contain letters or digits\.$/,
    translate: ([, username]) => `Tên đăng nhập "${username}" không hợp lệ, chỉ nên dùng chữ cái hoặc chữ số.`,
  },
  {
    pattern: /^(.+) is invalid, can only contain letters or digits\.$/,
    translate: ([, username]) => `Tên đăng nhập "${username}" không hợp lệ, chỉ nên dùng chữ cái hoặc chữ số.`,
  },
  {
    pattern: /^The (.+) field is not a valid e-mail address\.$/,
    translate: () => 'Email không hợp lệ.',
  },
  {
    pattern: /^The value '(.+)' is not valid for (.+)\.$/,
    translate: ([, value, field]) => `Giá trị "${value}" không hợp lệ cho trường ${translateField(field)}.`,
  },
  {
    pattern: /^The JSON value could not be converted to (.+)\.$/,
    translate: () => 'Dữ liệu gửi lên không đúng định dạng.',
  },
  {
    pattern: /^The field (.+) must be between (.+) and (.+)\.$/,
    translate: ([, field, min, max]) => `${translateField(field)} phải nằm trong khoảng ${min} đến ${max}.`,
  },
  {
    pattern: /^The (.+) field is required\.$/,
    translate: ([, field]) => `${translateField(field)} là bắt buộc.`,
  },
  {
    pattern: /^The field (.+) must be a string or array type with a maximum length of '(.+)'\.$/,
    translate: ([, field, length]) => `${translateField(field)} không được vượt quá ${length} ký tự.`,
  },
  {
    pattern: /^The field (.+) must be a string or array type with a minimum length of '(.+)'\.$/,
    translate: ([, field, length]) => `${translateField(field)} phải có ít nhất ${length} ký tự.`,
  },
]

const translateField = (field) => fieldNames.get(field) || field

export const translateErrorMessage = (message) => {
  if (!message) return 'Có lỗi xảy ra'

  const text = String(message).trim()
  if (exactMessages.has(text)) return exactMessages.get(text)

  for (const item of patternMessages) {
    const match = text.match(item.pattern)
    if (match) return item.translate(match)
  }

  return text
}

export const getErrorMessages = (payload, fallback = 'Có lỗi xảy ra') => {
  if (!payload) return [fallback]

  if (typeof payload === 'string') {
    return [translateErrorMessage(payload || fallback)]
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => translateErrorMessage(item.description || item.message || item)).filter(Boolean)
  }

  if (payload.errors) {
    return Object.values(payload.errors)
      .flat()
      .map((message) => translateErrorMessage(message))
      .filter(Boolean)
  }

  if (payload.title) return [translateErrorMessage(payload.title)]
  if (payload.message) return [translateErrorMessage(payload.message)]
  if (payload.description) return [translateErrorMessage(payload.description)]

  return [fallback]
}
