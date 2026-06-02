# FinanceApp

FinanceApp là ứng dụng quản lý cổ phiếu, bình luận và danh mục đầu tư cá nhân. Dự án gồm backend ASP.NET Core Web API làm phần chính và frontend React/Vite làm giao diện cơ bản để thao tác với API.

Trọng tâm của dự án là backend: thiết kế REST API, authentication bằng JWT, ASP.NET Core Identity, Entity Framework Core Code First, SQL Server, Repository Pattern, DTO/Mapper và phân quyền cho portfolio theo người dùng đăng nhập.

## Tổng quan tính năng

Backend:

- Đăng ký, đăng nhập và cấp JWT token.
- Quản lý cổ phiếu: thêm, xem, sửa, xóa.
- Tìm kiếm cổ phiếu theo symbol, tên công ty.
- Sắp xếp cổ phiếu theo symbol hoặc cổ tức gần nhất.
- Phân trang danh sách cổ phiếu.
- Bình luận trên từng cổ phiếu.
- Danh mục đầu tư cá nhân cho từng user.
- Bảo vệ endpoint portfolio và tạo bình luận bằng JWT.
- Seed role `Admin` và `User` qua EF Core migration.

Frontend hỗ trợ Backend:

- Đăng nhập, đăng ký.
- Xem danh sách cổ phiếu.
- Thêm, sửa, xóa cổ phiếu.
- Xem chi tiết cổ phiếu và bình luận.
- Thêm cổ phiếu vào danh mục.
- Xem và xóa cổ phiếu khỏi danh mục.
- Hiển thị thông báo lỗi bằng tiếng Việt.

## Công nghệ sử dụng

### Backend

| Thành phần | Công nghệ |
|------------|-----------|
| Framework | ASP.NET Core Web API |
| Target framework | .NET 10 |
| ORM | Entity Framework Core |
| Database | SQL Server |
| Authentication | ASP.NET Core Identity + JWT Bearer |
| Authorization | `[Authorize]` cho endpoint cần đăng nhập |
| Data access | Repository Pattern |
| API contract | DTO + Mapper |
| API docs | OpenAPI JSON |

### Frontend

| Thành phần | Công nghệ |
|------------|-----------|
| Framework | React 18 |
| Build tool | Vite |
| Routing | React Router v6 |
| HTTP client | Axios |
| Notification | react-hot-toast |
| Styling | CSS + Tailwind CSS v4 plugin |

## Cấu trúc dự án

```text
FinanceApp/
├── api/                     # Backend ASP.NET Core Web API
│   ├── Controllers/         # Account, Stock, Comment, Portfolio controllers
│   ├── Data/                # ApplicationDBContext
│   ├── Dtos/                # Request/response DTOs
│   ├── Extensions/          # Claims helper
│   ├── Helpers/             # QueryObject for filter/sort/pagination
│   ├── Interfaces/          # Repository/service contracts
│   ├── Mappers/             # Entity <-> DTO mapping
│   ├── Migrations/          # EF Core migrations
│   ├── Models/              # Domain entities
│   ├── Repository/          # Repository implementations
│   ├── Service/             # TokenService
│   ├── Program.cs           # DI, Identity, JWT, CORS, middleware
│   └── appsettings.json     # DB connection + JWT config
│
└── finance_frontend/        # Frontend React/Vite
    ├── src/components/      # Navbar, ProtectedRoute
    ├── src/context/         # Auth context
    ├── src/pages/           # Login, Register, Stocks, Portfolio
    ├── src/services/        # Axios API services
    ├── src/utils/           # Vietnamese error message helper
    └── vite.config.js       # Vite proxy to backend
```

## Backend chi tiết

### Kiến trúc backend

Backend được chia theo các lớp rõ ràng:

- `Controllers`: nhận HTTP request, gọi repository/service, trả response.
- `Interfaces`: định nghĩa contract như `IStockRepository`, `IPortfolioRepository`, `ICommentRepository`, `ITokenService`.
- `Repository`: xử lý truy vấn database bằng EF Core.
- `Dtos`: tách request/response model khỏi entity thật.
- `Mappers`: chuyển đổi entity sang DTO và ngược lại.
- `Models`: định nghĩa entity trong database.
- `Data/ApplicationDBContext.cs`: cấu hình DbContext, Identity, quan hệ entity và seed role.
- `Service/TokenService.cs`: tạo JWT token sau khi đăng nhập/đăng ký.

Mục tiêu của cách chia này là giữ controller gọn, tránh để logic truy vấn database nằm trực tiếp trong controller, đồng thời dễ mở rộng hoặc thay đổi tầng data access.

### Entity chính

| Entity | Vai trò |
|--------|---------|
| `AppUser` | User của ASP.NET Identity, có portfolio và user detail |
| `Stock` | Cổ phiếu, gồm symbol, company name, purchase, last dividend, industry, market cap |
| `Comment` | Bình luận thuộc một stock và một user |
| `Portfolio` | Bảng nối nhiều-nhiều giữa user và stock |
| `UserDetail` | Thông tin mở rộng của user |

### Quan hệ database

- `Stock` có nhiều `Comment`.
- `AppUser` có nhiều `Comment`.
- `AppUser` và `Stock` là quan hệ nhiều-nhiều thông qua `Portfolio`.
- `Portfolio` dùng composite key: `{ AppUserId, StockId }`.
- `AppUser` có quan hệ một-một với `UserDetail`.

### Authentication và Authorization

Backend dùng ASP.NET Core Identity để quản lý user và password policy.

Password policy hiện tại:

- Bắt buộc có chữ số.
- Bắt buộc có chữ thường.
- Bắt buộc có chữ hoa.
- Bắt buộc có ký tự đặc biệt.
- Độ dài tối thiểu 12 ký tự.

Sau khi đăng ký hoặc đăng nhập thành công, backend trả về:

```json
{
  "userName": "demo",
  "email": "demo@example.com",
  "token": "<jwt-token>"
}
```

JWT token chứa:

- `email`
- `given_name` là username
- issuer/audience lấy từ `appsettings.json`
- thời hạn 7 ngày
- ký bằng `HmacSha512`

Các endpoint cần đăng nhập:

- `GET /api/portfolio`
- `POST /api/portfolio`
- `DELETE /api/portfolio`
- `POST /api/comment/{stockId}`

Frontend gửi token qua header:

```http
Authorization: Bearer <jwt-token>
```

### Repository Pattern

Backend hiện có 3 repository chính:

| Repository | Chức năng |
|------------|-----------|
| `StockRepository` | CRUD stock, filter, sort, pagination, tìm stock theo symbol |
| `CommentRepository` | CRUD comment, eager loading stock |
| `PortfolioRepository` | Lấy portfolio theo user, thêm/xóa stock khỏi portfolio |

Ví dụ với `StockRepository.GetAllAsync`, API hỗ trợ:

- Filter theo `Symbol`.
- Filter theo `CompanyName`.
- Sort theo `Symbol` hoặc `LastDiv`.
- Sort tăng/giảm bằng `IsDescending`.
- Pagination bằng `PageNumber` và `PageSize`.

Query object:

```csharp
public class QueryObject
{
    public string? Symbol { get; set; }
    public string? CompanyName { get; set; }
    public string? SortBy { get; set; }
    public bool IsDescending { get; set; } = false;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
```

### API endpoints

#### Account

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/account/register` | No | Đăng ký user mới |
| POST | `/api/account/login` | No | Đăng nhập và nhận JWT |

#### Stock

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/stock` | No | Lấy danh sách stock, có filter/sort/page |
| GET | `/api/stock/{id}` | No | Lấy chi tiết stock |
| POST | `/api/stock` | No | Tạo stock |
| PUT | `/api/stock/{id}` | No | Cập nhật stock |
| DELETE | `/api/stock/{id}` | No | Xóa stock |

Query mẫu:

```http
GET /api/stock?symbol=AAPL&sortBy=LastDiv&isDescending=true&pageNumber=1&pageSize=10
```

#### Comment

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/comment` | No | Lấy tất cả bình luận |
| GET | `/api/comment/{id}` | No | Lấy bình luận theo id |
| POST | `/api/comment/{stockId}` | Yes | Tạo bình luận cho stock |
| PUT | `/api/comment/{id}` | No | Cập nhật bình luận |
| DELETE | `/api/comment/{id}` | No | Xóa bình luận |

#### Portfolio

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| GET | `/api/portfolio` | Yes | Lấy danh mục của user đang đăng nhập |
| POST | `/api/portfolio?symbol=AAPL` | Yes | Thêm stock vào danh mục |
| DELETE | `/api/portfolio?symbol=AAPL` | Yes | Xóa stock khỏi danh mục |

### Luồng hoạt động backend

#### Đăng ký / đăng nhập

```text
Client gửi username, email, password
    ↓
AccountController gọi UserManager / SignInManager
    ↓
Identity validate password và tạo/check user
    ↓
TokenService tạo JWT
    ↓
API trả userName, email, token
```

#### Thêm stock vào portfolio

```text
Client gửi POST /api/portfolio?symbol=AAPL kèm JWT
    ↓
PortfolioController đọc username từ claim given_name
    ↓
UserManager tìm AppUser
    ↓
StockRepository tìm Stock theo symbol
    ↓
PortfolioRepository kiểm tra danh mục hiện tại
    ↓
Nếu chưa tồn tại thì thêm record vào Portfolios
```

#### Tạo bình luận

```text
Client gửi POST /api/comment/{stockId} kèm JWT
    ↓
CommentController kiểm tra stock có tồn tại
    ↓
Đọc username từ JWT
    ↓
Tìm AppUser
    ↓
Map CreateCommentDto sang Comment
    ↓
Gán StockId và AppUserId
    ↓
Lưu vào database
```

## Frontend cơ bản

Frontend là React app dùng để thao tác với backend. Phần này giữ đơn giản, tập trung vào việc gọi API và hiển thị dữ liệu.

### Các màn hình

| Route | Mô tả |
|-------|------|
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/stocks` | Danh sách cổ phiếu |
| `/stocks/create` | Thêm cổ phiếu |
| `/stocks/:id` | Chi tiết cổ phiếu và bình luận |
| `/stocks/:id/edit` | Sửa cổ phiếu |
| `/portfolio` | Danh mục đầu tư cá nhân |

### Luồng frontend

```text
Người dùng mở app
    ↓
Chưa có token -> chuyển tới /login
    ↓
Đăng nhập/đăng ký thành công
    ↓
Lưu token, username, email vào localStorage
    ↓
Axios interceptor tự gắn Authorization header cho request sau
    ↓
Nếu API trả 401 -> xóa token và chuyển về /login
```

### Kết nối API

Frontend gọi API qua đường dẫn tương đối `/api`. Vite proxy chuyển request về backend:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5018',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

Ví dụ frontend gọi:

```js
api.get('/stock')
```

Vite sẽ proxy thành:

```text
http://localhost:5018/api/stock
```

## Yêu cầu trước khi chạy

### Bắt buộc

- .NET 10 SDK.
- Node.js 18 trở lên.
- npm 9 trở lên.
- SQL Server đang chạy.
- Connection string trong `api/appsettings.json` trỏ đúng SQL Server.

### Database mặc định trong repo

`api/appsettings.json` hiện đang dùng:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=FinanceAppDB;User Id=sa;Password=Admin123A@;TrustServerCertificate=True;"
  }
}
```

Nếu máy bạn dùng SQL Server khác, hãy sửa `DefaultConnection` trước khi chạy migration.

## Cách chạy project

### 1. Chạy backend

Mở terminal tại root project:

```bash
cd api
dotnet restore
dotnet ef database update
dotnet run --launch-profile http
```

Backend HTTP chạy tại:

```text
http://localhost:5018
```

OpenAPI JSON:

```text
http://localhost:5018/openapi/v1.json
```

Nếu chưa có `dotnet ef`, cài bằng:

```bash
dotnet tool install --global dotnet-ef
```

### 2. Chạy frontend

Mở terminal khác tại root project:

```bash
cd finance_frontend
npm install
npm run dev
```

Frontend thường chạy tại:

```text
http://localhost:5173
```

Nếu port `5173` đang bị chiếm, Vite sẽ tự chọn port khác, ví dụ `5174`.

## Thứ tự chạy đúng

```text
1. Bật SQL Server
2. Kiểm tra connection string trong api/appsettings.json
3. Chạy migration: dotnet ef database update
4. Chạy backend: dotnet run --launch-profile http
5. Chạy frontend: npm run dev
6. Mở frontend và đăng ký tài khoản mới
```

## Tài khoản đăng nhập

Backend không hard-code tài khoản mặc định. Hãy tạo tài khoản mới ở trang đăng ký.

Mật khẩu cần đủ mạnh. Ví dụ:

```text
123456789aA.
```

## Lệnh kiểm tra

### Backend

```bash
cd api
dotnet build
```

### Frontend

```bash
cd finance_frontend
npm run lint
npm run build
```

## Lỗi thường gặp

### Frontend không đăng nhập/đăng ký được

Kiểm tra backend có chạy ở `http://localhost:5018` không:

```bash
curl http://localhost:5018/openapi/v1.json
```

Nếu backend chạy port khác, sửa `target` trong `finance_frontend/vite.config.js`.

### Lỗi SQL Server connection

Nguyên nhân thường gặp:

- SQL Server chưa chạy.
- Sai username/password trong connection string.
- Database chưa được tạo/migrate.
- Port SQL Server không phải `1433`.

Chạy lại:

```bash
cd api
dotnet ef database update
```

### Lỗi password khi đăng ký

Password phải có:

- Ít nhất 12 ký tự.
- Ít nhất 1 chữ hoa.
- Ít nhất 1 chữ thường.
- Ít nhất 1 số.
- Ít nhất 1 ký tự đặc biệt.

### Lỗi 401 Unauthorized

Token sai hoặc hết hạn. Đăng xuất rồi đăng nhập lại.

### Lỗi port đã bị chiếm

Backend:

```text
Failed to bind to address http://127.0.0.1:5018: address already in use
```

Cách xử lý:

- Tắt process đang dùng port `5018`.
- Hoặc đổi port trong `api/Properties/launchSettings.json`.
- Nếu đổi port backend, nhớ sửa `finance_frontend/vite.config.js`.

## Điểm nổi bật backend

Các điểm kỹ thuật nên nhấn mạnh:

- Xây dựng RESTful API với ASP.NET Core.
- Thiết kế database bằng Entity Framework Core Code First.
- Sử dụng ASP.NET Core Identity để quản lý user và password policy.
- Tạo JWT token bằng `System.IdentityModel.Tokens.Jwt`.
- Bảo vệ endpoint bằng JWT Bearer Authentication.
- Tách tầng data access bằng Repository Pattern.
- Dùng DTO và Mapper để tách API contract khỏi entity.
- Hỗ trợ filter, sort, pagination cho danh sách cổ phiếu.
- Thiết kế portfolio theo user đang đăng nhập.
- Xử lý quan hệ nhiều-nhiều bằng composite key.

## Ghi chú về phạm vi frontend

Frontend trong dự án này đóng vai trò demo client cho backend. Giao diện đủ để test các workflow chính, nhưng trọng tâm đánh giá kỹ thuật của project là backend API, database design, authentication và data access layer.
