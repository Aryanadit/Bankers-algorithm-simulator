# Banker's Algorithm Simulator

A modern, user-friendly tool for simulating the Banker's Algorithm with enhanced UI/UX. This educational tool helps students, educators, and professionals understand deadlock avoidance through interactive visualization.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern Visual Design**: Clean, professional interface with gradient backgrounds and smooth animations
- **Progress Tracking**: Visual progress indicator showing current step in the algorithm
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Smooth loading animations during processing

### 🔧 Enhanced Functionality
- **Step-by-Step Process**: Clear workflow from input to results
- **Input Validation**: Comprehensive validation with helpful error messages
- **Visual Feedback**: Immediate feedback for all user interactions
- **Accessibility**: Improved keyboard navigation and screen reader support
- **Error Handling**: Graceful error handling with user-friendly messages
- **Total Instances Table**: Clear display of total available resources for each resource type

### 📊 Interactive Tables
- **Dynamic Table Generation**: Tables created based on user input
- **Real-time Validation**: Input validation as you type
- **Visual Hierarchy**: Clear distinction between different table types
- **Responsive Tables**: Tables adapt to different screen sizes

## 🚀 How to Use

1. **Open the Simulator**: Open `index.html` in your web browser
2. **Enter Parameters**: 
   - Number of processes (1-10)
   - Number of resource types (1-10)
3. **Create Tables**: Click "Create Tables" to generate input forms
4. **Fill Data**:
   - **Total Instances**: Total available resources for each resource type
   - **Allocation Matrix**: Currently allocated resources for each process
   - **Maximum Matrix**: Maximum resource needs for each process
5. **Calculate Need Matrix**: Click "Calculate Need Matrix" to compute Need = Maximum - Allocation
6. **Calculate Available Resources**: Click "Calculate Available Resources" to determine remaining resources
7. **Find Safe Sequence**: Click "Find Safe Sequence" to determine if the system is safe

## 📁 File Structure

```
BankersAlgorithm-Simulator-main/
├── index.html          # Main HTML file with modern structure
├── styles.css          # Modern CSS with responsive design
├── script.js           # Enhanced JavaScript with improved UX
├── README.md           # This documentation
└── [Original files]    # Original implementation files
```

## 🎯 Key Improvements

### UI/UX Enhancements
- **Modern Design**: Gradient backgrounds, rounded corners, and smooth animations
- **Better Typography**: Inter font family for improved readability
- **Icon Integration**: Font Awesome icons for better visual communication
- **Color Coding**: Different colors for different types of information
- **Hover Effects**: Interactive elements with hover states

### Functionality Improvements
- **Progress Tracking**: Visual progress indicator
- **Toast Notifications**: Real-time user feedback
- **Loading States**: Smooth loading animations
- **Input Validation**: Comprehensive validation with helpful messages
- **Error Handling**: Graceful error handling
- **Responsive Design**: Works on all device sizes
- **Total Instances Table**: Clear labeling of total resource instances

### Educational Features
- **Clear Instructions**: Step-by-step guidance
- **Visual Feedback**: Immediate feedback for all actions
- **Results Explanation**: Detailed explanations of results
- **Safe/Unsafe States**: Clear indication of system state
- **Original Logic Preservation**: All original algorithm logic is preserved

## 🔧 Technical Details

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dependencies
- Font Awesome 6.0.0 (CDN)
- Google Fonts - Inter (CDN)

## 📱 Responsive Design

The simulator is fully responsive and works on:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly controls
- **Mobile**: Simplified layout for small screens

## 🎓 Educational Value

This simulator is perfect for:
- **Students**: Learning deadlock avoidance concepts
- **Educators**: Teaching operating systems concepts
- **Professionals**: Understanding resource allocation algorithms

## 🚀 Getting Started

1. Download or clone the repository
2. Open `index.html` in your web browser
3. Follow the on-screen instructions
4. Experiment with different scenarios to understand the algorithm

## 📝 License

This project is open source and available under the MIT License.

---

**Note**: This is an improved version of the original Banker's Algorithm Simulator with enhanced UI/UX and modern web development practices. The original algorithm logic has been completely preserved while adding the Total Instances table for better clarity.
