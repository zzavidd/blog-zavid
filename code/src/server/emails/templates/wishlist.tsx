// import type { WishlistItem } from '@ziventi/wishlist/types';

// import { EmailStyle, EmailTheme } from '../constants';
// import { Anchor, Blockquote, Button, EmailParagraph } from '../lib/Components';
// import {
//   EmailBody,
//   EmailFooter,
//   Header,
//   Main,
//   SignatureImage,
// } from '../lib/Fragments';

// const Theme = EmailStyle.Color[EmailTheme];

// export default function WishlistClaimEmail({
//   wishlistItem,
// }: WishlistEmailProps) {
//   return (
//     <html>
//       <EmailBody>
//         <Header>Confirming your claim to a wishlist item on ZAVID.</Header>
//         <Main>
//           <EmailParagraph>Hey friend,</EmailParagraph>
//           <img
//             src={wishlistItem.image}
//             alt={wishlistItem.name}
//             style={{
//               border: `1px solid ${Theme.Text}`,
//               borderRadius: '10px',
//               float: 'right',
//               marginLeft: '1.5em',
//               maxWidth: '40%',
//             }}
//           />
//           <EmailParagraph>
//             You claimed the <strong>{wishlistItem.name}</strong> on my wishlist.
//           </EmailParagraph>
//           {wishlistItem.comments ? (
//             <Blockquote>
//               Note from me:
//               <br />
//               <br />
//               &ldquo;{wishlistItem.comments}&rdquo;
//             </Blockquote>
//           ) : null}
//           <EmailParagraph>
//             Click the button below to take you to the link.
//           </EmailParagraph>
//           <Anchor href={wishlistItem.href}>
//             <Button>Visit Link</Button>
//           </Anchor>
//           <EmailParagraph>
//             I appreciate you immensely for wanting to get me a gift off my
//             wishlist. It really means a lot.
//           </EmailParagraph>
//           <EmailParagraph>
//             In case you need to send the gift, below is my postal address:
//           </EmailParagraph>
//           <Blockquote style={{ fontStyle: 'italic' }}>
//             40 Impala Drive
//             <br />
//             Cambridge
//             <br />
//             CB1 9XL
//           </Blockquote>
//           <EmailParagraph>Bless you, friend. Much love.</EmailParagraph>
//           <EmailParagraph>Signed.</EmailParagraph>
//           <SignatureImage />
//         </Main>
//         <EmailFooter showUnsubscribe={false} />
//       </EmailBody>
//     </html>
//   );
// }

// interface WishlistEmailProps {
//   wishlistItem: WishlistItem;
// }
