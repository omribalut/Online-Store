import { CartModel } from "../models/cart.model";

export class CartsState {
    public cart: CartModel;

    public constructor() {
        // this.cart = localStorage.getItem("cart");
        this.cart = JSON.parse(localStorage.getItem("cart"))

    }

    // public constructor() {
    //     this.token = localStorage.getItem("token");
    //     if(this.token) {
    //         const encodedObject: any = jwtDecode(this.token);
    //         this.user = encodedObject.user;
    //     }
    // }


}

export enum CartsActionType {
    GetCart = "GetCart",
    Delete = "Delete"
    // CreateCart = "CreateCart"
}

export interface CartsAction {
    type: CartsActionType;
    payload?: any;
}

export function getCartAction(cart: CartModel): CartsAction {
    return { type: CartsActionType.GetCart, payload: cart };
}
export function deleteCartAction(): CartsAction {
    return { type: CartsActionType.Delete };
}
// do we even need this????????????????????????????????????????????????????
// export function createCartAction(cart: CartModel): CartsAction {
//     return { type: CartsActionType.CreateCart, payload: cart };
// }

export function cartsReducer(currentState = new CartsState(), action: CartsAction): CartsState {

    // Must duplicate the current state and not touch the given current state: 
    const newState = { ...currentState };

    switch (action.type) {

        case CartsActionType.GetCart:
            newState.cart = action.payload; // Here the payload is the products list.
            localStorage.setItem("cart",JSON.stringify(newState.cart));
            break;
        case CartsActionType.Delete:
            localStorage.removeItem("cart");
            newState.cart = null;


        // case CartsActionType.CreateCart:
        //     newState.cart.push(action.payload);
        //     break;
    }
    return newState;

}