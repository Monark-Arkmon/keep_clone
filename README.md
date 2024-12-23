# 📝 Google Keep Clone

A React-based clone of Google Keep with drag-and-drop functionality, note organization, and a Material UI interface.

[Live Demo](https://monark-arkmon.github.io/keep_clone/)

## Features

- Create, edit, and delete notes
- Drag and drop notes to reorder
- Archive and restore notes
- Trash management system
- Responsive Material UI design
- Animated interactions
- Persistent sidebar navigation

## Tech Stack

- React
- Material UI
- React Router v6
- React Beautiful DnD
- UUID

## Installation

```bash
# Clone the repository
git clone git@github.com:Monark-Arkmon/keep_clone.git

# Navigate to project directory
cd keep_clone

# Install dependencies
npm install

# Start development server
npm start
```

## Usage

- Click "Take a note..." to create a new note
- Drag notes to reorder them
- Use the sidebar to navigate between active notes, archives, and trash
- Click on a note to edit its contents
- Use archive/delete icons to manage notes
- Restore notes from archive or trash as needed

## Project Structure

- `App.js`: Main application component and routing logic
- `App.css`: Custom styling and animations
- Components:
  - `Form`: Note creation interface
  - `Note`: Individual note display and management
  - `SwipeDrawer`: Collapsible sidebar navigation
  - `Archives`: Archived notes view
  - `DeleteNotes`: Trash management view

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
