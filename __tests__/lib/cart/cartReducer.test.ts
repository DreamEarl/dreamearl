import {
  cartReducer,
  initialCartState,
  CartState,
} from "@/lib/cart/cartReducer";

const item1 = {
  id: "p1",
  name: "GLEAMSLING",
  subtitle: "Phone Sling Bag",
  price: 4599,
  image: "/gleamsling.jpg",
  href: "/products/gleamsling",
  brand: "DREAMEARL",
  currency: "Rs.",
  color: "Ivory",
};

const item2 = {
  id: "p2",
  name: "PEARLA",
  price: 2999,
  image: "/pearla.jpg",
  href: "/products/pearla",
  brand: "DREAMEARL",
  currency: "Rs.",
};

describe("cartReducer", () => {
  describe("initial state", () => {
    it("has an empty items array", () => {
      expect(initialCartState.items).toEqual([]);
    });
  });

  describe("ADD_TO_CART", () => {
    it("adds a new item with quantity 1", () => {
      const state = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual({ ...item1, quantity: 1 });
    });

    it("increments quantity when same id is added again", () => {
      const stateWithOne = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      const stateWithTwo = cartReducer(stateWithOne, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      expect(stateWithTwo.items).toHaveLength(1);
      expect(stateWithTwo.items[0].quantity).toBe(2);
    });

    it("adds a second distinct item", () => {
      const stateWithOne = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      const stateWithTwo = cartReducer(stateWithOne, {
        type: "ADD_TO_CART",
        payload: item2,
      });
      expect(stateWithTwo.items).toHaveLength(2);
    });

    it("does not mutate existing state", () => {
      const before = { ...initialCartState };
      cartReducer(initialCartState, { type: "ADD_TO_CART", payload: item1 });
      expect(initialCartState).toEqual(before);
    });
  });

  describe("REMOVE_FROM_CART", () => {
    it("removes the item with the given id", () => {
      const stateWith = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      const stateWithout = cartReducer(stateWith, {
        type: "REMOVE_FROM_CART",
        payload: { id: "p1" },
      });
      expect(stateWithout.items).toHaveLength(0);
    });

    it("only removes the matching item", () => {
      let state = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      state = cartReducer(state, { type: "ADD_TO_CART", payload: item2 });
      state = cartReducer(state, {
        type: "REMOVE_FROM_CART",
        payload: { id: "p1" },
      });
      expect(state.items).toHaveLength(1);
      expect(state.items[0].id).toBe("p2");
    });

    it("is a no-op when id does not exist", () => {
      const stateWith = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      const after = cartReducer(stateWith, {
        type: "REMOVE_FROM_CART",
        payload: { id: "nonexistent" },
      });
      expect(after.items).toHaveLength(1);
    });
  });

  describe("UPDATE_QUANTITY", () => {
    let stateWithItem: CartState;

    beforeEach(() => {
      stateWithItem = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
    });

    it("updates quantity to the given value", () => {
      const state = cartReducer(stateWithItem, {
        type: "UPDATE_QUANTITY",
        payload: { id: "p1", quantity: 5 },
      });
      expect(state.items[0].quantity).toBe(5);
    });

    it("removes item when quantity is set to 0", () => {
      const state = cartReducer(stateWithItem, {
        type: "UPDATE_QUANTITY",
        payload: { id: "p1", quantity: 0 },
      });
      expect(state.items).toHaveLength(0);
    });

    it("removes item when quantity is set to a negative number", () => {
      const state = cartReducer(stateWithItem, {
        type: "UPDATE_QUANTITY",
        payload: { id: "p1", quantity: -1 },
      });
      expect(state.items).toHaveLength(0);
    });

    it("only updates the matching item", () => {
      let state = cartReducer(stateWithItem, {
        type: "ADD_TO_CART",
        payload: item2,
      });
      state = cartReducer(state, {
        type: "UPDATE_QUANTITY",
        payload: { id: "p1", quantity: 3 },
      });
      const p1 = state.items.find((i) => i.id === "p1");
      const p2 = state.items.find((i) => i.id === "p2");
      expect(p1?.quantity).toBe(3);
      expect(p2?.quantity).toBe(1);
    });
  });

  describe("CLEAR_CART", () => {
    it("empties all items", () => {
      let state = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      state = cartReducer(state, { type: "ADD_TO_CART", payload: item2 });
      state = cartReducer(state, { type: "CLEAR_CART" });
      expect(state.items).toHaveLength(0);
    });

    it("returns the initial state shape", () => {
      let state = cartReducer(initialCartState, {
        type: "ADD_TO_CART",
        payload: item1,
      });
      state = cartReducer(state, { type: "CLEAR_CART" });
      expect(state).toEqual(initialCartState);
    });
  });
});
