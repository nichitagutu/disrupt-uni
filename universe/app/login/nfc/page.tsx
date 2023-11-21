"use client";

import LoginText from "@/components/LoginText";
import { Dispatch, SetStateAction, useState } from "react";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
// @ts-ignore
import { HaloGateway, execHaloCmdWeb } from "@arx-research/libhalo/api/web";
import { text } from "@/constants";

const Gate = new HaloGateway("wss://s1.halo-gateway.arx.org");
Gate.gatewayServerHttp = "https://s1.halo-gateway.arx.org/e";

export default function NFCLoginPage() {
  const [pairedWallet, setPairedWallet] = useState<string>("");
  const [pairingLink, setPairingLink] = useState<string>("");
  return (
    <main className="flex flex-col items-center justify-center gap-4">
      <LoginText
        header={"Join the Universe portal"}
        text={
          "Universe enables university communities participation in the budgeting and funds spending to limit corruption and money-laundering."
        }
      />
      <NFCLoginButton
        setPairingLink={setPairingLink}
        setPairedWallet={setPairedWallet}
      />
      {/* TODO: add two buttons: pair with another card and go forward to the next stage */}
    </main>
  );
}

function NFCLoginButton({
  setPairingLink,
  setPairedWallet,
}: {
  setPairingLink: Dispatch<SetStateAction<string>>;
  setPairedWallet: Dispatch<SetStateAction<string>>;
}) {
  const [buttonText, setButtonText] = useState<string>(
    text.nfcLoginPage.buttonStates.initialButtonState
  );

  async function desktopConnect(): Promise<string> {
    try {
      const pairInfo = await Gate.startPairing();
      setPairingLink(pairInfo.execURL);
    } catch (e) {
      throw e;
    }

    try {
      await Gate.waitConnected();
    } catch (e) {
      throw e;
    }

    setPairingLink("");

    return await initiateSession(false);
  }

  async function initiateSession(isOnMobile: boolean): Promise<string> {
    const command = {
      name: "sign",
      message: "hello world",
      keyNo: 1,
      format: "text",
    };

    try {
      const result = isOnMobile
        ? await execHaloCmdWeb(command)
        : await Gate.execHaloCmd(command);
      return result.input.etherAddress;
    } catch (e) {
      throw e;
    }
  }

  async function loginClickHandler() {
    let pairedWallet = "";
    setButtonText(text.nfcLoginPage.buttonStates.connectingButtonState);
    try {
      if (isMobile) {
        pairedWallet = await initiateSession(true);
      } else {
        pairedWallet = await desktopConnect();
      }
    } catch (error) {
      toast.error(text.nfcLoginPage.toastMessages.failure);
      setButtonText(text.nfcLoginPage.buttonStates.initialButtonState);
      return;
    }

    setPairedWallet(pairedWallet);
    setButtonText(
      text.nfcLoginPage.buttonStates.pairedButtonState + pairedWallet
    );
    toast.success(text.nfcLoginPage.toastMessages.success);
  }
  return (
    <button
      className="bg-[#F0C600] px-16 py-2 font-bold"
      onClick={loginClickHandler}
    >
      {buttonText}
    </button>
  );
}
