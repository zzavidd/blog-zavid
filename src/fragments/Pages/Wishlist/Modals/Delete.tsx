// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   Typography,
// } from '@mui/material';
// import React from 'react';
// import * as SWR from 'swr';

// import { Route } from 'utils/constants';
// import Contexts, { WishlistPageContext } from 'utils/contexts';
// import Utils from 'utils/functions';

// export default function DeleteItemModal() {
//   const [context, setContext] = React.useContext(WishlistPageContext);
//   const consign = Utils.createDispatch(setContext);
//   const Snacks = React.useContext(Contexts.Snacks);

//   /**
//    * Deletes the selected wishlist item.
//    */
//   async function deleteWishlistItem() {
//     try {
//       if (!context.selectedWishlistItem) {
//         throw new Error('No wishlist item selected.');
//       }

//       await Utils.request<ItemPayload.Delete>(Route.Wishlist, {
//         method: 'DELETE',
//         body: { id: context.selectedWishlistItem.id },
//       });
//       consign({ isDeletePromptVisible: false });
//       await SWR.mutate(Route.Wishlist);
//       Snacks.success(
//         `You've successfully deleted '${context.selectedWishlistItem.name}'.`,
//       );
//     } catch (e: any) {
//       Snacks.error(e.message);
//     }
//   }

//   /**
//    * Closes the delete prompt.
//    */
//   function onCancel() {
//     consign({ isDeletePromptVisible: false });
//   }

//   return (
//     <Dialog open={context.isDeletePromptVisible} onClose={onCancel}>
//       <DialogContent>
//         <Typography>
//           Are you sure you want to delete&nbsp;
//           <Typography display={'inline'} fontWeight={'bold'}>
//             {context.selectedWishlistItem?.name}
//           </Typography>
//           ?
//         </Typography>
//       </DialogContent>
//       <DialogActions>
//         <Button
//           variant={'contained'}
//           onClick={deleteWishlistItem}
//           color={'error'}>
//           Delete
//         </Button>
//         <Button variant={'outlined'} onClick={onCancel}>
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
