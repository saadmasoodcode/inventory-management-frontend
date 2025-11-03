# Inventory Management

A web application built with **React**, **TypeScript**, and **Material-UI** for managing inventory, sales, purchases, and party relationships (companies, customers, salesmen).

## 🚀 Key Features

- **Party Management:** Create, view, update, and delete companies, customers, and salesmen.  
- **Item Management:** Full CRUD operations for items, including purchase/sale pricing and unit management.  
- **Purchase Invoices:** Create and manage purchase invoices with item selection, quantity, pricing, and narration.  
- **Sale Invoices:** Generate sales invoices with customer, company, and salesman associations.  
- **Reports:** Generate item-wise invoice reports with filtering by date and invoice type.  
- **Responsive UI:** Clean, modern interface built with Material-UI and custom styling.  

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Material-UI, React Hook Form, Yup Validation  
- **State Management:** React Hook Form, useState, useEffect  
- **HTTP Client:** Axios  
- **Routing:** React Router DOM  
- **Backend API:** RESTful endpoints (e.g., `/api/v1/party`, `/api/v1/item`, `/api/v1/inventoryTransaction`)  

## 📦 Modules

- **Parties:** Manage companies, customers, and salesmen.  
- **Items:** Manage product catalog with company association.  
- **Purchase:** Create and view purchase invoices.  
- **Sales:** Create and view sales invoices.  
- **Reports:** View item invoice reports with filters.  

## 🧩 Notable Components

- `AddPurchaseInvoiceItem` / `AddSaleInvoiceItem`: Modal forms for adding items to invoices.  
- `AddPurchaseItemList` / `AddSaleItemList`: Tabular displays of invoice items with edit/delete actions.  
- `CreatePurchaseInvoice` / `CreateSaleInvoice`: Full invoice creation forms with validation.  
- `ItemInvoicesReport`: Report generation with date and type filters.  

## 🔗 Backend Integration

The frontend interacts with a **Node.js backend** (assumed) via **REST API** endpoints for all CRUD operations and reporting.

-----------------------------------------------------------------------------------------------------------------------------

![AppImages](./src/assets/Screenshot%202025-09-15%20104347.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20104443.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20104730.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20104752.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20104820.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20104911.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20104930.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20104955.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20105348.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20105403.png)
![AppImages](./src/assets/Screenshot%202025-09-15%20105511.png)

