module.exports = {
  SUCCESS: 0, //默认成功
  ERROR: 1, //默认错误
  UNAUTHORIZED_OPERATION: 2, //越权操作

  ILLEGAL_ARGUMENT: 3, //非法参数
  ARGUMENT_CAN_NOT_BE_NULL: 4, //参数不能为null
  ARGUMENT_RANGE_ERROR: 5, //参数范围错误
  ARGUMENT_CAN_NOT_BE_BLANK: 6, //参数不能为空

  NEED_LOGIN: 10, //需要登录
  FIRST_LOGIN: 11, //首次登录
  LOGIN_SUCCESS: 12, //登录成功
  LOGIN_FALSE: 13, //登录失败
  NOT_LOGIN: 14, //未登录状态
  HAVE_LOGGED: 15, //已登录状态
  REGISTER_SUCCESS: 16, //注册成功
  REGISTER_FALSE: 17, //注册失败
  USER_EXIST: 18, //用户已经存在
  USER_NOT_EXIST: 19, //用户不存在
  LOGOUT_SUCCESS: 20, //退出登录成功

  AUTH_CODE_NOT_EXIST: 130, //认证码不存在
  AUTH_CODE_HAS_BEEN_USED: 131, //认证码已经被使用
  AUTH_CODE_FORMAT_ERROR: 132, //认证码格式错误

  NOT_AUTH_BY_THE_DEPARTMENT: 140, //未通过部门认证
  FULLNAME_CAN_NOT_BE_NULL: 141, //fullname不能未空
  QRCODE_INVALID: 142, //二维码失效
  TOKEN_INVALID: 143, //token无效
  TOO_SHORT_TIME_INTERVAL: 144, //时间间隔过短
  QRCODE_CAN_NOT_BE_NULL: 145, // 二维码不能为空

  START_TIME_GREATER_THEN_END_TIME: 160, //开始时间大于结束时间
  LENDING_TOO_LONG: 161, //借用时间过长
  THIS_PERIOD_HAS_BEEN_BORROWED: 162, //该时间段已经被借用

  COOKIE_NOT_EXIST: 180, //cookie不存在

  UPLOAD_FILE_SUCCESS: 233, //上传文件成功
  UPLOAD_FILE_FAIL: 234, //上传文件成功

  THUMB_UP_SUCCESS: 280, //点赞成功
  CANCEL_THUMB_UP_SUCCESS: 281, //取消点赞成功
  ATTENTION_SUCCESS: 282, //关注成功
  CANCEL_ATTENTION_SUCCESS: 283, //取消关注成功
  COLLECTION_SUCCESS: 284, //收藏成功
  CANCEL_COLLECTION_SUCCESS: 285, //取消收藏成功

}