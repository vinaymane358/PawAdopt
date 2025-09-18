# PawAdopt - Pet Adoption Platform

A comprehensive pet adoption platform built with Angular, featuring both user-facing and admin interfaces for managing pet adoptions.

## 🐾 Features

### User Module
- **Home Page**: Hero banner with featured pets and platform overview
- **Pet Listings**: Browse and search pets with advanced filtering (breed, age, size, location)
- **Pet Details**: Detailed pet information with adoption request functionality
- **User Authentication**: Login/Register with profile management
- **Adoption Requests**: Track adoption requests and view adoption history
- **About/Contact**: Platform information and contact details

### Shelter Module
- **Dashboard**: Overview of shelter pets, adoption requests, and statistics
- **Pet Management**: Add, edit, delete, and manage pet information for your shelter
- **Adoption Requests**: Review, approve, or reject adoption requests for your pets
- **Reports & Analytics**: Detailed insights and performance metrics for your shelter

### Admin Module
- **Dashboard**: Comprehensive overview with statistics and charts
- **Pet Management**: Add, edit, delete, and manage pet information
- **Adoption Requests**: Review, approve, or reject adoption requests
- **User Management**: Manage user accounts and permissions
- **Reports & Analytics**: Detailed insights and performance metrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Angular CLI (v17 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pawadopt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/                    # Home page component
│   │   ├── pet-listings/           # Pet browsing and search
│   │   ├── pet-details/            # Individual pet details
│   │   ├── auth/                   # Login/Register forms
│   │   ├── user-profile/           # User profile management
│   │   ├── adoption-requests/      # User adoption requests
│   │   ├── about/                  # About page
│   │   ├── contact/                # Contact page
│   │   ├── shelter/                # Shelter components
│   │   │   ├── shelter-dashboard/  # Shelter dashboard
│   │   │   ├── shelter-pet-management/ # Pet CRUD operations
│   │   │   ├── shelter-adoption-requests/ # Request management
│   │   │   └── shelter-reports/    # Analytics and reports
│   │   └── admin/                  # Admin components
│   │       ├── admin-dashboard/    # Admin dashboard
│   │       ├── admin-pet-management/ # Pet CRUD operations
│   │       ├── admin-adoption-requests/ # Request management
│   │       ├── admin-user-management/ # User management
│   │       └── admin-reports/      # Analytics and reports
│   ├── models/                     # TypeScript interfaces
│   ├── services/                   # Data services and API calls
│   ├── guards/                     # Route guards for authentication
│   ├── app.component.ts           # Main app component
│   └── app.routes.ts              # Application routing
├── img/                           # Pet images and assets
└── styles.css                     # Global styles
```

## 🔧 Key Technologies

- **Angular 17**: Modern Angular framework with standalone components
- **TypeScript**: Type-safe JavaScript
- **HTML5 & CSS3**: Modern web standards
- **Responsive Design**: Mobile-first approach
- **Font Awesome**: Icons and visual elements

## 📱 Features Overview

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Navigation**: Easy-to-use interface with clear call-to-actions
- **Advanced Search**: Filter pets by breed, age, size, location, and more
- **Real-time Updates**: Live status updates for adoption requests
- **Image Gallery**: High-quality pet photos with fallback handling

### Admin Features
- **Comprehensive Dashboard**: Real-time statistics and performance metrics
- **Pet Management**: Full CRUD operations for pet information
- **Request Processing**: Streamlined approval/rejection workflow
- **User Administration**: Account management and role-based access
- **Analytics**: Detailed reports and insights

## 🔐 Authentication

### Test Accounts
- **User Account**: 
  - Email: `user@example.com`
  - Password: `password`
- **Shelter Account**: 
  - Email: `shelter@example.com`
  - Password: `shelter123`
- **Admin Account**: 
  - Email: `admin@example.com`
  - Password: `admin123`

## 🎨 Design System

### Color Palette
- **Primary**: #3b82f6 (Blue)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Yellow)
- **Error**: #ef4444 (Red)
- **Neutral**: #6b7280 (Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700 weight
- **Body**: 400-500 weight

## 📊 Data Models

### Pet
- Basic info (name, breed, age, size, gender, color)
- Health status (vaccinated, spayed/neutered)
- Location and shelter information
- Adoption status and special needs

### User
- Personal information and contact details
- Role-based permissions (User, Admin, SuperAdmin)
- Account status and activity tracking

### Adoption Request
- Pet and user information
- Request status and admin comments
- Timestamps and review history

## 🚀 Deployment

### Build Configuration
The project is configured for production builds with:
- Optimized bundles
- Tree shaking
- Minification
- Source maps (development only)

### Environment Setup
1. Configure your backend API endpoints
2. Set up authentication tokens
3. Configure image storage URLs
4. Set up database connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: info@pawadopt.com
- Phone: (555) 123-4567
- Address: 123 Pet Street, New York, NY 10001

## 🔮 Future Enhancements

- Real-time notifications
- Mobile app development
- Advanced matching algorithms
- Video pet profiles
- Integration with veterinary services
- Multi-language support
- Advanced analytics dashboard

---

**PawAdopt** - Connecting loving families with pets in need of forever homes. 🐾❤️
