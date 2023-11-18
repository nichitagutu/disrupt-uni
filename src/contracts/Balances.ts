import { RuntimeModule, runtimeMethod, state } from "@proto-kit/module";
import { StateMap, assert } from "@proto-kit/protocol";
import { Bool, Field, Provable, PublicKey, UInt64 } from "o1js";

export class Balances extends RuntimeModule<unknown> {
  // Define a state map to keep track of balances associated with public keys.
  @state() public balances = StateMap.from<PublicKey, UInt64>(
    PublicKey,
    UInt64
  );

  // Method to add (mint) a specified amount to a user's balance.
  public mint(to: PublicKey, amount: UInt64) {
    const balance = this.balances.get(to);
    const newBalance = balance.value.add(amount);
    this.balances.set(to, newBalance);
  }

  // @runtimeMethod()
  // public transferSigned(from...) {
  //   assert(this.transaction.sender.equals(from));
  //   this.transfer(...)
  // }

  // Method to transfer an amount from one public key to another.
  public transfer(from: PublicKey, to: PublicKey, amount: UInt64) {
    const fromBalance = this.balances.get(from);

    // Check if the sender has enough balance to make the transfer.
    assert(fromBalance.value.greaterThanOrEqual(amount), "Insufficient funds for transfer");

    // Conditional subtraction from the sender's balance
    const hasEnoughFunds = Bool(fromBalance.value.greaterThanOrEqual(amount));
    const newFromBalanceValue = Provable.if(
      hasEnoughFunds,
      fromBalance.value.sub(amount),
      fromBalance.value
    );
    this.balances.set(from, newFromBalanceValue);

    // Add the amount to the recipient's balance.
    const toBalance = this.balances.get(to);
    const newToBalanceValue = toBalance.value.add(amount);
    this.balances.set(to, newToBalanceValue);
  }
}
