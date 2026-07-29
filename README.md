# PMG Backend

Backend API for PMG Website with MongoDB integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Update `MONGODB_URI` with your MongoDB connection string
- Update `JWT_SECRET` with a secure secret key

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Contacts
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Create new contact
- `DELETE /api/contacts/:id` - Delete contact

### Health
- `GET /api/health` - Server health check

## MongoDB Models

### Blog
- title (required)
- excerpt (required)
- content (required)
- date (required)
- category (required)
- author (default: 'PMG Team')
- imageUrl (optional)
- createdAt (auto)
- updatedAt (auto)

### Contact
- name (required)
- email (required)
- company (optional)
- message (required)
- createdAt (auto)
