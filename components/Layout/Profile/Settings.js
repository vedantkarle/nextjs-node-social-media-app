import { useEffect, useRef, useState } from "react";
import {
	Accordion,
	AccordionItem,
	AccordionItemButton,
	AccordionItemHeading,
	AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import Switch from "react-switch";
import { toast } from "react-toastify";
import UpdatePassword from "./UpdatePassword";

const Settings = ({ newMessagePopup }) => {
	const [showUpdatePassword, setShowUpdatePassword] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	const [popupSetting, setPopupSetting] = useState(newMessagePopup);

	const isFirstRun = useRef(true);

	useEffect(() => {
		success && toast.success("Updates Successfully");
		error && toast.error("Something went wrong.Try Again");
	}, [success, error]);

	useEffect(() => {
		if (isFirstRun.current) {
			isFirstRun.current = false;
			return;
		}
	}, [popupSetting]);

	return (
		<div>
			<Accordion allowZeroExpanded>
				<AccordionItem>
					<AccordionItemHeading>
						<AccordionItemButton style={{ backgroundColor: "transparent" }}>
							Update Password
						</AccordionItemButton>
					</AccordionItemHeading>
					<AccordionItemPanel>
						<UpdatePassword setSuccess={setSuccess} setError={setError} />
					</AccordionItemPanel>
				</AccordionItem>
				<AccordionItem>
					<AccordionItemHeading>
						<AccordionItemButton style={{ backgroundColor: "transparent" }}>
							Show New Message Popup?
						</AccordionItemButton>
					</AccordionItemHeading>
					<AccordionItemPanel>
						<div style={{ marginTop: "10px" }}>
							Control whether a Popup should appear when there is new message
						</div>
						<br />
						<Switch onChange={() => {}} checked={popupSetting} />
					</AccordionItemPanel>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default Settings;
