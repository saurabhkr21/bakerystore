# Bakery Store Management System

A comprehensive Point of Sale (POS) and inventory management system designed specifically for bakery businesses. This modern web application provides complete control over sales, inventory, bulk orders, and business analytics.

## 🚀 Features

### Core Functionality
- **Point of Sale (POS)**: Complete sales management with cart functionality, multiple payment methods, and receipt generation
- **Inventory Management**: Track products, stock levels, pricing, and low-stock alerts
- **Bulk Orders**: Handle large orders, catering requests, and advance payments
- **User Management**: Role-based access control with admin, manager, and staff permissions
- **Reports & Analytics**: Comprehensive business insights with charts and performance metrics
- **Settings**: Company information management and system configuration

### Key Capabilities
- **Real-time Stock Tracking**: Automatic inventory updates with sales
- **Multi-payment Support**: Cash, card, and UPI payment methods
- **Role-based Permissions**: Secure access control for different user types
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with shadcn/ui components

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bakery-store-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application.

### Build for Production

```bash
npm run build
# or
yarn build
```

## 👥 User Roles & Permissions

### Admin
- Full system access
- User management
- Company settings
- All sales and inventory operations
- Complete reports access

### Manager
- Inventory management
- Sales operations
- Bulk order management
- Reports viewing
- Staff oversight

### Staff
- Point of sale operations
- Stock viewing
- Personal sales tracking

## 🔐 Default Login Credentials

For demonstration purposes, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bakery.com | admin |
| Manager | manager@bakery.com | manager |
| Staff | staff@bakery.com | staff |

## 📱 Application Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # App layout components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (Auth, etc.)
├── data/              # Mock data and sample content
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Main application pages
│   ├── Dashboard.tsx  # Main dashboard with analytics
│   ├── Inventory.tsx  # Product and stock management
│   ├── Sales.tsx      # Point of sale interface
│   ├── BulkOrders.tsx # Large order management
│   ├── Reports.tsx    # Business analytics
│   ├── UserManagement.tsx # User administration
│   └── Settings.tsx   # System configuration
└── types/             # TypeScript type definitions
```

## 🎯 Key Features Explained

### Dashboard
- Real-time sales metrics
- Low stock alerts
- Top-selling products
- Daily sales trends
- Quick action buttons for staff

### Inventory Management
- Add/edit/delete products
- Stock level monitoring
- Category-based organization
- Price management
- Low stock notifications

### Point of Sale
- Intuitive item selection
- Shopping cart functionality
- Multiple payment methods
- Customer information capture
- Discount application
- Receipt generation

### Bulk Orders
- Large order creation
- Advance payment tracking
- Delivery date scheduling
- Order status management
- Customer communication

### Reports & Analytics
- Sales performance metrics
- Staff performance tracking
- Category-wise analysis
- Monthly trends
- Export capabilities

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: WCAG compliant components
- **Modern Interface**: Clean, professional design
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Real-time Updates**: Live data synchronization

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for custom configuration:

```env
VITE_APP_TITLE=Bakery Store Management
VITE_API_URL=http://localhost:3000/api
```

### Customization
- **Company Information**: Update in Settings page
- **Product Categories**: Modify in `src/pages/Inventory.tsx`
- **User Roles**: Extend in `src/types/index.ts`
- **Color Scheme**: Customize in `tailwind.config.ts`

## 📊 Data Management

The application currently uses mock data for demonstration. To integrate with a real backend:

1. Replace mock data in `src/data/mockData.ts`
2. Implement API calls in respective components
3. Add proper error handling and loading states
4. Configure authentication with your backend

## 🚀 Deployment

### Build and Deploy
```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

### Recommended Hosting Platforms
- **Vercel**: Easy deployment with Git integration
- **Netlify**: Simple drag-and-drop deployment
- **AWS S3**: Scalable static hosting
- **GitHub Pages**: Free hosting for public repositories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## 🔮 Future Enhancements

- **Backend Integration**: Connect to a real database and API
- **Barcode Scanning**: Product identification via barcode
- **Receipt Printing**: Thermal printer integration
- **Multi-location Support**: Multiple store management
- **Customer Management**: Customer database and loyalty programs
- **Advanced Analytics**: More detailed reporting and insights
- **Mobile App**: Native mobile application
- **Offline Support**: PWA capabilities for offline operation

---

**Built with ❤️ for bakery businesses worldwide**