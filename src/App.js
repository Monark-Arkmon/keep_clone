import { createContext, useState, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Box, Grid, Card, CardContent, CardActions, Typography,
  AppBar, Toolbar, IconButton, List, ListItem, ListItemIcon, ListItemText,
  TextField, ClickAwayListener
} from '@mui/material';
import {
  Menu,
  LightbulbOutlined as Lightbulb,
  ArchiveOutlined as Archive,
  DeleteOutlineOutlined as Delete,
  UnarchiveOutlined as Unarchive,
  RestoreFromTrashOutlined as Restore,
  DeleteForeverOutlined as DeleteForever
} from '@mui/icons-material';
import MuiDrawer from '@mui/material/Drawer';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { 
  Dialog,
  DialogContent,
} from '@mui/material';
import './App.css';
// Create Context
const DataContext = createContext(null);

// Styled Components
const Header = styled(AppBar)`
  z-index: 1201;
  background: #fff;
  height: 70px;
  box-shadow: inset 0 -1px 0 0 #dadce0;
`;

const Heading = styled(Typography)`
  color: #5F6368;
  font-size: 24px;
  margin-left: 25px;
`;

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const StyledCard = styled(Card)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 240px;
  margin: 8px;
  box-shadow: none;
`;

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  margin: auto;
  box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
  border-color: #e0e0e0;
  width: 600px;
  border-radius: 8px;
  min-height: 30px;
  padding: 10px 15px;
`;

const EmptyContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20vh;
`;

// Drawer Configuration
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

// Components
const HeaderBar = ({ open, handleDrawer }) => {
  const logo = 'https://seeklogo.com/images/G/google-keep-logo-0BC92EBBBD-seeklogo.com.png';
  
  return (
    <Header open={open}>
      <Toolbar>
        <IconButton
          onClick={handleDrawer}
          sx={{ marginRight: '20px' }}
          edge="start"
        >
          <Menu />
        </IconButton>
        <img src={logo} alt="logo" style={{width: 30}} />
        <Heading>Keep</Heading>
      </Toolbar>
    </Header>
  );
};

const NavList = () => {
  const navList = [
    { id: 1, name: 'Notes', icon: <Lightbulb />, route: '/' },
    { id: 2, name: 'Archives', icon: <Archive />, route: '/archive' },
    { id: 3, name: 'Trash', icon: <Delete />, route: '/delete' },
  ];
  const [activeIndex, setActiveIndex] = useState(null);
  const handleNavClick = (index) => {
    setActiveIndex(index);
  };
  return (
    <List>
      {navList.map((list, index) => (
        <ListItem
          button
          key={list.id}
          component={Link}
          to={list.route}
          className={activeIndex === index ? "navbar-click" : ""}
          onClick={() => handleNavClick(index)}
        >
          <ListItemIcon>
            {list.icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Link to={list.route} className="navbar-link">
                {list.name}
              </Link>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};


const SwipeDrawer = () => {
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen(prevState => !prevState);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderBar
        open={open}
        handleDrawer={handleDrawer}
      />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        <NavList />
      </Drawer>
    </Box>
  );
};

const EditNoteModal = ({ note, open, handleClose, onSave }) => {
  const [editedNote, setEditedNote] = useState(note);

  const handleChange = (e) => {
    setEditedNote(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = () => {
    onSave(editedNote);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      onBackdropClick={onSubmit}
      PaperProps={{
        style: {
          borderRadius: 8,
          padding: '8px 0'
        }
      }}
    >
      <DialogContent>
        <TextField
          placeholder="Title"
          variant="standard"
          InputProps={{ disableUnderline: true }}
          style={{ marginBottom: 10 }}
          onChange={handleChange}
          name="heading"
          value={editedNote.heading}
          fullWidth
        />
        <TextField
          placeholder="Take a note..."
          multiline
          minRows={3}
          maxRows={Infinity}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          onChange={handleChange}
          name="text"
          value={editedNote.text}
          fullWidth
        />
      </DialogContent>
    </Dialog>
  );
};

const Note = ({ note }) => {
  const { notes, setNotes, setAcrchiveNotes, setDeleteNotes } = useContext(DataContext);
  const [openEdit, setOpenEdit] = useState(false);

  const archiveNote = (note) => {
    const updatedNotes = notes.filter(data => data.id !== note.id);
    setNotes(updatedNotes);
    setAcrchiveNotes(prevArr => [note, ...prevArr]);
  };

  const deleteNote = (note) => {
    const updatedNotes = notes.filter(data => data.id !== note.id);
    setNotes(updatedNotes);
    setDeleteNotes(prevArr => [note, ...prevArr]);
  };

  const handleEdit = () => {
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
  };

  const saveEditedNote = (editedNote) => {
    const updatedNotes = notes.map(n => 
      n.id === editedNote.id ? editedNote : n
    );
    setNotes(updatedNotes);
  };

  return (
    <>
      <StyledCard onClick={handleEdit} className="note-open">
        <CardContent>
          <Typography>{note.heading}</Typography>
          <Typography>{note.text}</Typography>
        </CardContent>
        <CardActions>
        <Archive 
          className="archive-delete-click"
          onClick={(e) => {
            e.stopPropagation();
            archiveNote(note);
          }}
          />
          <Delete 
          className="archive-delete-click"
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note);
          }}
          />
        </CardActions>
      </StyledCard>

      <EditNoteModal
        note={note}
        open={openEdit}
        handleClose={handleClose}
        onSave={saveEditedNote}
      />
    </>
  );
};

const Form = () => {
  const [showTextField, setShowTextField] = useState(false);
  const [addNote, setAddNote] = useState({ id: uuid(), heading: '', text: '' });
  const { setNotes } = useContext(DataContext);
  const containerRef = useRef();

  const handleClickAway = () => {
    setShowTextField(false);
    containerRef.current.style.minheight = '30px';
    
    if (addNote.heading || addNote.text) {
      setNotes(prevArr => [addNote, ...prevArr]);
      setAddNote({ id: uuid(), heading: '', text: '' });
    }
  };
  
  const onTextAreaClick = () => {
    setShowTextField(true);
    containerRef.current.style.minheight = '70px';
  };

  const onTextChange = (e) => {
    setAddNote(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Container ref={containerRef}>
        {showTextField && 
          <TextField 
            placeholder="Title"
            variant="standard"
            InputProps={{ disableUnderline: true }}
            style={{ marginBottom: 10 }}
            onChange={onTextChange}
            name='heading'
            value={addNote.heading}
          />
        }
        <TextField
          placeholder="Take a note..."
          multiline
          maxRows={Infinity}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          onClick={onTextAreaClick}
          onChange={onTextChange}
          name='text'
          value={addNote.text}
        />
      </Container>
    </ClickAwayListener>
  );
};

const EmptyNotes = () => (
  <EmptyContainer>
    <Lightbulb style={{ fontSize: 120, color: '#F5F5F5' }} />
    <Typography style={{ color: '#80868b', fontSize: 22 }}>
      Notes you add appear here
    </Typography>
  </EmptyContainer>
);

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Notes = () => {
  const { notes, setNotes } = useContext(DataContext);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = reorder(notes, result.source.index, result.destination.index);    
    setNotes(items);
  };
  
  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ p: 3, width: '100%' }}>
        <DrawerHeader />
        <Form />
        {notes.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <Grid container style={{ marginTop: 16}}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {notes.map((note, index) => (
                    <Draggable key={note.id} draggableId={note.id} index={index}>
                      {(provided) => (
                        <Grid ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          item
                        >
                          <Note note={note} />
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
        ) : <EmptyNotes />}
      </Box>
    </Box>
  );
};

const ArchivedNote = ({ archive }) => {
  const { archiveNotes, setNotes, setAcrchiveNotes, setDeleteNotes } = useContext(DataContext);

  const unArchiveNote = (archive) => {
    const updatedNotes = archiveNotes.filter(data => data.id !== archive.id);
    setAcrchiveNotes(updatedNotes);
    setNotes(prevArr => [archive, ...prevArr]);
  };

  const deleteNote = (archive) => {
    const updatedNotes = archiveNotes.filter(data => data.id !== archive.id);
    setAcrchiveNotes(updatedNotes);
    setDeleteNotes(prevArr => [archive, ...prevArr]);
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography>{archive.heading}</Typography>
        <Typography>{archive.text}</Typography>
      </CardContent>
      <CardActions>
        <Unarchive 
          fontSize="small" 
          style={{ marginLeft: 'auto' }} 
          onClick={() => unArchiveNote(archive)}
        />
        <Delete 
          fontSize="small"
          onClick={() => deleteNote(archive)}
        />
      </CardActions>
    </StyledCard>
  );
};

// Update the Archives component to use ArchivedNote
const Archives = () => {
  const { archiveNotes } = useContext(DataContext);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ p: 3, width: '100%' }}>
        <DrawerHeader />
        <Grid container>
          {archiveNotes.map(archive => (
            <Grid item key={archive.id}>
              <ArchivedNote archive={archive} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const DeleteNotes = () => {
  const { deleteNotes } = useContext(DataContext);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Box sx={{ p: 3, width: '100%' }}>
        <DrawerHeader />
        <Grid container>
          {deleteNotes.map(deleteNote => (
            <Grid item key={deleteNote.id}>
              <DeleteNote deleteNote={deleteNote} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const DeleteNote = ({ deleteNote }) => {
  const { deleteNotes, setNotes, setDeleteNotes } = useContext(DataContext);

  const restoreNote = (deleteNote) => {
    const updatedNotes = deleteNotes.filter(data => data.id !== deleteNote.id);
    setDeleteNotes(updatedNotes);
    setNotes(prevArr => [deleteNote, ...prevArr]);
  };

  const removeNote = (deleteNote) => {
    const updatedNotes = deleteNotes.filter(data => data.id !== deleteNote.id);
    setDeleteNotes(updatedNotes);
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography>{deleteNote.heading}</Typography>
        <Typography>{deleteNote.text}</Typography>
      </CardContent>
      <CardActions>
        <DeleteForever
          fontSize="small" 
          style={{ marginLeft: 'auto' }} 
          onClick={() => removeNote(deleteNote)}
        />
        <Restore
          fontSize="small"
          onClick={() => restoreNote(deleteNote)}
        />
      </CardActions>
    </StyledCard>
  );
};

const DataProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [archiveNotes, setAcrchiveNotes] = useState([]);
  const [deleteNotes, setDeleteNotes] = useState([]);

  return (
    <DataContext.Provider value={{
      notes,
      setNotes,
      archiveNotes,
      setAcrchiveNotes,
      deleteNotes,
      setDeleteNotes
    }}>
      {children}
    </DataContext.Provider>
  );
};

const App = () => {
  return (
    <DataProvider>
      <Router>
        <SwipeDrawer />
        <Box className="main-content">
          <Routes>
            <Route path="/" element={<Notes />} />
            <Route path="/archive" element={<Archives />} />
            <Route path="/delete" element={<DeleteNotes />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Router>
    </DataProvider>
  );
};

export default App;
