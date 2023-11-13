export default function CategoryForm() {
  return null;
}

// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DoneIcon from '@mui/icons-material/Done';
// import {
//   Button,
//   ButtonGroup,
//   IconButton,
//   InputAdornment,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Paper,
//   Stack,
//   TextField,
//   Tooltip,
//   Typography,
// } from '@mui/material';
// import React, { useContext, useMemo, useState } from 'react';
// import { Route, TrayFormContent } from 'utils/constants';
// import { zCategoryDelete, zCategoryUpsert } from 'utils/validations';
// import { v4 as UUIDv4 } from 'uuid';

// import Utils from 'utils/functions';

// import { WishlistContext } from '../WishlistContext';
// import { trpc } from 'utils/trpc';

// export default function CategoryForm() {
//   const [context, setContext] = useContext(WishlistContext);
//   const [state, setState] = useState<CategoryFormState>({ newCategories: {} });

//   const allCategories = useMemo<Record<string | number, CachedCategory>>(() => {
//     return { ...context.categories, ...state.newCategories };
//   }, [context.categories, state.newCategories]);

//   /**
//    * Add a new category entry.
//    */
//   function addCategory() {
//     const uuid = UUIDv4();
//     setState({
//       newCategories: {
//         ...state.newCategories,
//         [uuid]: {
//           name: '',
//           count: 0,
//         },
//       },
//     });
//   }

//   function deleteUnsavedCategory(id: string): boolean {
//     if (context.categories[id]) return false;

//     const categories = { ...state.newCategories };
//     delete categories[id];
//     dispatch({ newCategories: categories });
//     return true;
//   }

//   /**
//    * Returns to the wishlist form.
//    */
//   function returnToWishlistForm() {
//     dispatch({ newCategories: {} });
//     consign({ trayFormContent: TrayFormContent.WISHLIST_ITEM });
//   }

//   return (
//     <React.Fragment>
//       <Stack spacing={2}>
//         <Typography variant={'h3'}>Manage Categories</Typography>
//         <Button onClick={addCategory} startIcon={<AddIcon />}>
//           Add Category
//         </Button>
//         <List>
//           {Object.entries(allCategories).map(([id, { name, count }], i) => {
//             return (
//               <CategoryEntry
//                 category={{ lid: i + 1, id, name, count }}
//                 deleteUnsavedCategory={deleteUnsavedCategory}
//                 key={id}
//               />
//             );
//           })}
//         </List>
//       </Stack>
//       <Paper
//         elevation={7}
//         sx={{
//           borderRadius: 0,
//           position: 'sticky',
//           bottom: 0,
//           p: 3,
//           top: 'auto',
//         }}>
//         <ButtonGroup fullWidth={true}>
//           <Button onClick={returnToWishlistForm}>Back to Wishlist Form</Button>
//         </ButtonGroup>
//       </Paper>
//     </React.Fragment>
//   );
// }

// function CategoryEntry(props: CategoryEntryProps) {
//   const [state, setState] = useState({ value: props.category.name });
//   const Snacks = useContext(Contexts.Snacks);

//   const {} = trpc.wishlistCategory.

//   async function onSave() {
//     try {
//       const payload = zCategoryUpsert.parse({
//         id: props.category.id,
//         name: state.value,
//       });
//       await Utils.request<CategoryPayload.Upsert>(Route.Categories, {
//         method: 'POST',
//         body: payload,
//       });
//       await mutate(Route.Categories);
//       props.deleteUnsavedCategory(props.category.id);
//       Snacks.success(`Category "${payload.name}" saved.`);
//     } catch (e) {
//       Utils.handleError(e, Snacks);
//     }
//   }

//   async function onDelete() {
//     const isDeleted = props.deleteUnsavedCategory(props.category.id);
//     if (isDeleted) return;

//     try {
//       const payload = zCategoryDelete.parse({ id: props.category.id });
//       await Utils.request<CategoryPayload.Delete>(Route.Categories, {
//         method: 'DELETE',
//         body: payload,
//       });
//       await mutate(Route.Categories);
//       Snacks.success(`Category "${props.category.name}" deleted.`);
//     } catch (e) {
//       Utils.handleError(e, Snacks);
//     }
//   }

//   function onTextChange(e: React.ChangeEvent<HTMLInputElement>) {
//     setState({ value: e.target.value });
//   }

//   const itemCount = `${props.category.count} ${
//     props.category.count === 1 ? 'item' : 'items'
//   }`;
//   const showSaveIcon = state.value && state.value !== props.category.name;

//   return (
//     <ListItem disableGutters={true} sx={{ gap: (t) => t.spacing(5) }}>
//       <ListItemText sx={{ flex: 'initial' }}>{props.category.lid}</ListItemText>
//       <ListItemText
//         primary={
//           <TextField
//             value={state.value}
//             onChange={onTextChange}
//             placeholder={'Enter category name'}
//             helperText={itemCount}
//             fullWidth={true}
//             error={!state.value}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position={'end'}>
//                   {showSaveIcon ? (
//                     <Tooltip title={'Click to save'}>
//                       <IconButton onClick={onSave}>
//                         <DoneIcon color={'primary'} />
//                       </IconButton>
//                     </Tooltip>
//                   ) : (
//                     <IconButton onClick={onSave}>{null}</IconButton>
//                   )}
//                 </InputAdornment>
//               ),
//             }}
//           />
//         }
//       />
//       <ListItemIcon>
//         <IconButton onClick={onDelete}>
//           <DeleteIcon />
//         </IconButton>
//       </ListItemIcon>
//     </ListItem>
//   );
// }

// interface CategoryFormState {
//   newCategories: Record<string, CachedCategory>;
// }
// interface CategoryEntryProps {
//   category: {
//     lid: number;
//     id: string;
//     name: string;
//     count: number;
//   };
//   deleteUnsavedCategory: (id: string) => boolean;
// }
