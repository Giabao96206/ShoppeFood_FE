import { useCurrentApp } from "@/src/context/app.context";
import { router } from "expo-router";
import ItemSingle from "./item.single";

interface Irops {
  menuIT: IMenuItems;
  restaurant: IMenuRestaurant | null;
  isModal: boolean;
}

const ItemQuantity = (props: Irops) => {
  let quantity: number = 0;
  const { menuIT, restaurant, isModal } = props;
  const { cart, setCart } = useCurrentApp();

  const HandlePresItem = (item: IMenuItems, action: "MINUS" | "PLUS") => {
    if (item.options.length > 0 && isModal === false) {
      router.navigate({
        pathname:
          action === "PLUS" ? "/product/create.modal" : "/product/update.modal",
        params: { menuItemId: menuIT._id },
      });
    } else {
      const total = action === "MINUS" ? -1 : 1;
      if (!cart[restaurant!._id]) {
        cart[restaurant!._id] = {
          sum: 0,
          quantity: 0,
          items: {},
        };
      }
      // Xử lí
      cart[restaurant!._id].sum =
        cart[restaurant!._id].sum + total * item.basePrice;
      cart[restaurant!._id].quantity = cart[restaurant!._id].quantity + total;

      // Check sp tồn tại chưa
      if (!cart[restaurant!._id].items[item._id]) {
        cart[restaurant!._id].items[item._id] = {
          quantity: 0,
          data: menuIT,
        };
      }
      const currentQuantity = cart[restaurant!._id].items[item._id].quantity;
      cart[restaurant!._id].items[item._id] = {
        quantity: currentQuantity + total,
        data: menuIT,
      };

      if (cart[restaurant!._id].items[item._id].quantity <= 0) {
        delete cart[restaurant!._id].items[item._id];
      }
      setCart((prevState: any) => ({ ...prevState, ...cart }));
    }
  };

  let showMinus = false;
  if (restaurant?._id) {
    const store = cart[restaurant._id];
    if (store?.items && store.items[menuIT._id]) {
      showMinus = true;
      quantity = store.items[menuIT._id].quantity;
    }
  }

  return (
    <ItemSingle
      menuIT={menuIT}
      HandlePresItem={HandlePresItem}
      showMinus={showMinus}
      quantity={quantity}
    />
  );
};

export default ItemQuantity;
