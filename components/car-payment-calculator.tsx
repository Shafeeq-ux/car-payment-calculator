"use client";

import type React from "react";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	PlusCircle,
	Trash2,
	Download,
	FileImage,
	ChevronDown,
} from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

// Define types for our line items
type LineItem = {
	id: string;
	name: string;
	value: number;
};

// Car make and model data
const carData: Record<
	string,
	{
		models: string[];
		trims: Record<string, string[]>;
	}
> = {
	Acura: {
		models: ["ILX", "MDX", "RDX", "TLX", "NSX"],
		trims: {
			ILX: ["Base", "Premium", "Technology", "A-Spec"],
			MDX: ["Base", "Technology", "A-Spec", "Advance", "Type S"],
			RDX: ["Base", "Technology", "A-Spec", "Advance"],
			TLX: ["Base", "Technology", "A-Spec", "Advance", "Type S"],
			NSX: ["Base", "Type S"],
		},
	},
	Audi: {
		models: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "e-tron"],
		trims: {
			A3: ["Premium", "Premium Plus", "Prestige", "S3"],
			A4: ["Premium", "Premium Plus", "Prestige", "S4"],
			A6: ["Premium", "Premium Plus", "Prestige", "S6"],
			Q3: ["Premium", "Premium Plus", "Prestige"],
			Q5: ["Premium", "Premium Plus", "Prestige", "SQ5"],
			Q7: ["Premium", "Premium Plus", "Prestige"],
			"e-tron": ["Premium", "Premium Plus", "Prestige", "S"],
		},
	},
	BMW: {
		models: ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "i4", "iX"],
		trims: {
			"3 Series": ["330i", "330e", "M340i", "M3"],
			"5 Series": ["530i", "530e", "540i", "M550i", "M5"],
			"7 Series": ["740i", "750i", "760i", "i7"],
			X1: ["sDrive28i", "xDrive28i"],
			X3: ["sDrive30i", "xDrive30i", "M40i", "X3 M"],
			X5: ["sDrive40i", "xDrive40i", "xDrive45e", "M50i", "X5 M"],
			i4: ["eDrive40", "M50"],
			iX: ["xDrive50", "M60"],
		},
	},
	Chevrolet: {
		models: ["Malibu", "Camaro", "Corvette", "Equinox", "Tahoe", "Silverado"],
		trims: {
			Malibu: ["LS", "RS", "LT", "Premier"],
			Camaro: ["LS", "LT", "SS", "ZL1"],
			Corvette: ["Stingray", "Z06", "ZR1"],
			Equinox: ["LS", "LT", "RS", "Premier"],
			Tahoe: ["LS", "LT", "RST", "Z71", "Premier", "High Country"],
			Silverado: ["WT", "Custom", "LT", "RST", "LTZ", "High Country"],
		},
	},
	Ford: {
		models: ["Mustang", "F-150", "Explorer", "Escape", "Bronco", "Mach-E"],
		trims: {
			Mustang: ["EcoBoost", "GT", "Mach 1", "Shelby GT500"],
			"F-150": [
				"XL",
				"XLT",
				"Lariat",
				"King Ranch",
				"Platinum",
				"Limited",
				"Raptor",
			],
			Explorer: [
				"Base",
				"XLT",
				"ST-Line",
				"Limited",
				"ST",
				"Platinum",
				"King Ranch",
			],
			Escape: ["S", "SE", "SEL", "Titanium"],
			Bronco: [
				"Base",
				"Big Bend",
				"Black Diamond",
				"Outer Banks",
				"Badlands",
				"Wildtrak",
			],
			"Mach-E": ["Select", "Premium", "California Route 1", "GT"],
		},
	},
	Honda: {
		models: ["Civic", "Accord", "CR-V", "Pilot", "HR-V", "Odyssey"],
		trims: {
			Civic: ["LX", "Sport", "EX", "Touring", "Si", "Type R"],
			Accord: ["LX", "Sport", "Sport SE", "EX-L", "Touring", "Hybrid"],
			"CR-V": ["LX", "EX", "EX-L", "Touring", "Hybrid"],
			Pilot: [
				"LX",
				"EX",
				"EX-L",
				"Special Edition",
				"TrailSport",
				"Touring",
				"Elite",
			],
			"HR-V": ["LX", "Sport", "EX-L"],
			Odyssey: ["LX", "EX", "EX-L", "Touring", "Elite"],
		},
	},
	Hyundai: {
		models: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "Ioniq 5"],
		trims: {
			Elantra: ["SE", "SEL", "Limited", "N Line", "N"],
			Sonata: ["SE", "SEL", "SEL Plus", "Limited", "N Line"],
			Tucson: ["SE", "SEL", "N Line", "Limited", "Hybrid"],
			"Santa Fe": ["SE", "SEL", "XRT", "Limited", "Calligraphy"],
			Kona: ["SE", "SEL", "N Line", "Limited", "N"],
			"Ioniq 5": ["SE", "SEL", "Limited"],
		},
	},
	Lexus: {
		models: ["IS", "ES", "LS", "NX", "RX", "GX", "LX"],
		trims: {
			IS: ["300", "350", "500", "F Sport"],
			ES: ["250", "350", "300h", "F Sport"],
			LS: ["500", "500h", "F Sport"],
			NX: ["250", "350", "350h", "450h+", "F Sport"],
			RX: ["350", "350h", "450h+", "500h", "F Sport"],
			GX: ["460", "550"],
			LX: ["600"],
		},
	},
	Tesla: {
		models: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
		trims: {
			"Model 3": ["Rear-Wheel Drive", "Long Range", "Performance"],
			"Model Y": ["Rear-Wheel Drive", "Long Range", "Performance"],
			"Model S": ["Model S", "Plaid"],
			"Model X": ["Model X", "Plaid"],
			Cybertruck: ["Rear-Wheel Drive", "All-Wheel Drive", "Cyberbeast"],
		},
	},
	Toyota: {
		models: [
			"Corolla",
			"Camry",
			"RAV4",
			"Highlander",
			"4Runner",
			"Tacoma",
			"Prius",
		],
		trims: {
			Corolla: ["L", "LE", "SE", "XLE", "XSE", "Hybrid"],
			Camry: ["LE", "SE", "XLE", "XSE", "TRD", "Hybrid"],
			RAV4: [
				"LE",
				"XLE",
				"XLE Premium",
				"Adventure",
				"TRD Off-Road",
				"Limited",
				"Hybrid",
			],
			Highlander: ["L", "LE", "XLE", "XSE", "Limited", "Platinum", "Hybrid"],
			"4Runner": ["SR5", "TRD Sport", "TRD Off-Road", "Limited", "TRD Pro"],
			Tacoma: ["SR", "SR5", "TRD Sport", "TRD Off-Road", "Limited", "TRD Pro"],
			Prius: ["LE", "XLE", "Limited", "Prime"],
		},
	},
};

// Generate array of years from 1995 to 2026
const generateYearArray = (startYear: number, endYear: number) => {
	const years: number[] = [];
	for (let year = startYear; year <= endYear; year++) {
		years.push(year);
	}
	return years;
};

// Default line items for each category with OEM references

export default function CarPaymentCalculator() {
	// Vehicle details
	const [vehicleYear, setVehicleYear] = useState("");
	const [vehicleMake, setVehicleMake] = useState("");
	const [vehicleModel, setVehicleModel] = useState("");
	const [vehicleTrim, setVehicleTrim] = useState("");

	// Basic inputs
	const [purchasePrice, setPurchasePrice] = useState(49900);
	const [downPayment, setDownPayment] = useState(2000);
	const [loanAmount, setLoanAmount] = useState(47900);
	const [apr, setApr] = useState(5.99);
	const [loanTerm, setLoanTerm] = useState(48);

	// Generate a unique ID
	const generateId = () => {
		return Math.random().toString(36).substring(2, 9);
	};

	// Create default items with OEM references
	const createDefaultAccessories = () => [
		{ id: generateId(), name: "Factory All-Weather Floor Mats", value: 175 },
		{ id: generateId(), name: "OEM Roof Rack/Cross Bars", value: 350 },
		{ id: generateId(), name: "Interior Ambient Lighting Package", value: 250 },
		{ id: generateId(), name: "Towing Package", value: 1200 },
		{ id: generateId(), name: "Premium Wheels Upgrade", value: 1500 },
		{ id: generateId(), name: "Other (Custom)", value: 0 },
	];

	const createDefaultOffersRebates = () => [
		{ id: generateId(), name: "Manufacturer Cash Rebate", value: 2500 },
		{ id: generateId(), name: "Loyalty Discount", value: 1000 },
		{ id: generateId(), name: "Military/First Responder Discount", value: 500 },
		{ id: generateId(), name: "College Graduate Program", value: 750 },
		{ id: generateId(), name: "Year-End Clearance Incentive", value: 1500 },
		{ id: generateId(), name: "Other (Custom)", value: 0 },
	];

	const createDefaultProtectionPlans = () => [
		{ id: generateId(), name: "Extended Manufacturer Warranty", value: 1800 },
		{ id: generateId(), name: "Tire & Wheel Protection", value: 900 },
		{ id: generateId(), name: "Paintless Dent Repair Plan", value: 600 },
		{ id: generateId(), name: "Key Replacement Coverage", value: 250 },
		{ id: generateId(), name: "Gap Insurance", value: 800 },
		{ id: generateId(), name: "Other (Custom)", value: 0 },
	];

	const createDefaultSubscriptions = () => [
		{
			id: generateId(),
			name: "Premium Connected Services (3 years)",
			value: 900,
		},
		{
			id: generateId(),
			name: "Advanced Driver Assistance Subscription",
			value: 750,
		},
		{ id: generateId(), name: "OEM Navigation & Map Updates", value: 450 },
		{ id: generateId(), name: "Premium Audio Streaming", value: 300 },
		{ id: generateId(), name: "Remote Access Services Package", value: 550 },
		{ id: generateId(), name: "Other (Custom)", value: 0 },
	];

	const createDefaultChargers = () => [
		{ id: generateId(), name: "OEM Level 2 Home Charging Station", value: 800 },
		{ id: generateId(), name: "Professional Installation", value: 600 },
		{
			id: generateId(),
			name: "Portable Level 1 Emergency Charger",
			value: 300,
		},
		{
			id: generateId(),
			name: "Commercial Charging Network Credit",
			value: 500,
		},
		{ id: generateId(), name: "Charging Cable Organizer", value: 120 },
		{ id: generateId(), name: "Other (Custom)", value: 0 },
	];

	// Multiple line items
	const [tradeIns, setTradeIns] = useState<LineItem[]>([]);
	const [accessories, setAccessories] = useState<LineItem[]>([]);
	const [offersRebates, setOffersRebates] = useState<LineItem[]>([]);
	const [protectionPlans, setProtectionPlans] = useState<LineItem[]>([]);
	const [subscriptions, setSubscriptions] = useState<LineItem[]>([]);
	const [chargers, setChargers] = useState<LineItem[]>([]);

	// Totals
	const [tradeInTotal, setTradeInTotal] = useState(0);
	const [accessoriesTotal, setAccessoriesTotal] = useState(0);
	const [offersRebatesTotal, setOffersRebatesTotal] = useState(0);
	const [protectionPlansTotal, setProtectionPlansTotal] = useState(0);
	const [subscriptionsTotal, setSubscriptionsTotal] = useState(0);
	const [chargersTotal, setChargersTotal] = useState(0);

	const [monthlyPayment, setMonthlyPayment] = useState(0);
	const calculatorRef = useRef<HTMLDivElement>(null);

	// For year selection
	const years = useMemo(() => generateYearArray(1995, 2026), []);

	// For model and trim selection
	const [availableModels, setAvailableModels] = useState<string[]>([]);
	const [availableTrims, setAvailableTrims] = useState<string[]>([]);

	// Update available models when make changes
	useEffect(() => {
		if (vehicleMake && carData[vehicleMake]) {
			setAvailableModels(carData[vehicleMake].models);
			setVehicleModel(""); // Reset model when make changes
			setVehicleTrim(""); // Reset trim as well
		} else {
			setAvailableModels([]);
		}
	}, [vehicleMake]);

	// Update available trims when model changes
	useEffect(() => {
		if (
			vehicleMake &&
			vehicleModel &&
			carData[vehicleMake]?.trims[vehicleModel]
		) {
			setAvailableTrims(carData[vehicleMake].trims[vehicleModel]);
		} else {
			setAvailableTrims([]);
		}
	}, [vehicleMake, vehicleModel]);

	// Format currency input
	const formatCurrency = (value: number): string => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	};

	// Parse currency string to number
	const parseCurrency = (value: string): number => {
		// First, strip any non-numeric characters except for decimal points and minus signs
		const sanitized = value.replace(/[^\d.-]/g, "");

		// Convert to number and handle invalid inputs
		const num = parseFloat(sanitized);

		// Return 0 if not a valid number
		return isNaN(num) ? 0 : num;
	};

	// Handle input change with currency formatting
	const handleCurrencyChange = (
		value: string,
		setter: React.Dispatch<React.SetStateAction<number>>
	) => {
		// Only proceed if the value contains valid numeric input
		if (value === "" || /^-?\d*\.?\d*$/.test(value.replace(/[$,]/g, ""))) {
			setter(parseCurrency(value));
		}
	};

	// Handle focus for currency inputs
	const handleCurrencyFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		e.target.select();
	};

	// Add a new line item
	const addLineItem = (
		items: LineItem[],
		setItems: React.Dispatch<React.SetStateAction<LineItem[]>>,
		defaultName: string
	) => {
		const id = generateId();
		let name = "";

		// Use appropriate default names based on the type
		switch (defaultName) {
			case "Vehicle":
				name = "Vehicle Trade-in";
				break;
			case "Accessory":
				name = "New Accessory";
				break;
			case "Rebate":
				name = "New Rebate";
				break;
			case "Protection Plan":
				name = "New Protection Plan";
				break;
			case "Subscription":
				name = "New Subscription";
				break;
			case "Charger":
				name = "New Charger";
				break;
			default:
				name = defaultName;
		}

		setItems([
			...items,
			{
				id,
				name,
				value: 0,
			},
		]);
	};

	// Remove a line item
	const removeLineItem = (
		id: string,
		items: LineItem[],
		setItems: React.Dispatch<React.SetStateAction<LineItem[]>>
	) => {
		setItems(items.filter((item) => item.id !== id));
	};

	// Update a line item name
	const updateItemName = (
		id: string,
		name: string,
		items: LineItem[],
		setItems: React.Dispatch<React.SetStateAction<LineItem[]>>
	) => {
		// Create a new array with the updated item
		const updatedItems = items.map((item) =>
			item.id === id ? { ...item, name: name } : item
		);

		// Directly update the state
		setItems(updatedItems);
	};

	// Update a line item value
	const updateItemValue = (
		id: string,
		valueStr: string,
		items: LineItem[],
		setItems: React.Dispatch<React.SetStateAction<LineItem[]>>
	) => {
		// Parse the value string to a number
		const value = parseCurrency(valueStr);

		// Important: Don't overwrite existing item names
		const updatedItems = items.map((item) => {
			if (item.id === id) {
				return { ...item, value: value };
			}
			return item;
		});

		// Update the items state
		setItems(updatedItems);
	};

	// Focus management to ensure inputs are editable
	const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		// Prevent any default behaviors that might interfere with editing
		e.currentTarget.select();
	};

	// Custom Input Component for Line Items
	const LineItemInput = ({
		value,
		onChange,
		placeholder = "",
		isCurrency = false,
	}: {
		value: string;
		onChange: (value: string) => void;
		placeholder?: string;
		isCurrency?: boolean;
	}) => {
		const [localValue, setLocalValue] = useState(value);
		const [isFocused, setIsFocused] = useState(false);
		const inputRef = useRef<HTMLInputElement>(null);

		// Update local value when prop changes and not focused
		useEffect(() => {
			if (!isFocused) {
				setLocalValue(value);
			}
		}, [value, isFocused]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;

			// Update local state immediately for all inputs
			setLocalValue(newValue);

			// For non-currency fields, update parent state immediately
			// Allow alphanumeric characters, spaces, and common punctuation
			if (!isCurrency) {
				onChange(newValue);
			} else {
				// For currency fields, only validate the input format
				if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
					// Valid currency format, don't call onChange yet (wait for blur)
				} else {
					// Revert to previous valid value if invalid currency format
					setLocalValue(localValue);
				}
			}
		};

		const handleBlur = () => {
			setIsFocused(false);
			// Only process currency values on blur
			if (isCurrency) {
				const parsedValue = parseCurrency(localValue);
				const currencyValue = formatCurrency(parsedValue);
				setLocalValue(currencyValue);
				onChange(currencyValue);
			}
		};

		const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(true);
			if (isCurrency) {
				// For currency fields, show raw value when focused
				const rawValue = parseCurrency(localValue).toString();
				setLocalValue(rawValue);
			}
			e.target.select();
		};

		return (
			<input
				ref={inputRef}
				type="text"
				inputMode={isCurrency ? "decimal" : "text"}
				className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				value={localValue}
				onChange={handleChange}
				onBlur={handleBlur}
				onFocus={handleFocus}
				placeholder={placeholder}
			/>
		);
	};

	// Custom Currency Input Component
	const CurrencyInput = ({
		id,
		value,
		onChange,
		label,
	}: {
		id: string;
		value: number;
		onChange: (value: number) => void;
		label: string;
	}) => {
		const [localValue, setLocalValue] = useState(formatCurrency(value));
		const [isFocused, setIsFocused] = useState(false);
		const inputRef = useRef<HTMLInputElement>(null);

		// Update local value when prop changes if not focused
		useEffect(() => {
			if (!isFocused) {
				setLocalValue(formatCurrency(value));
			}
		}, [value, isFocused]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;

			// Only allow numbers, a single decimal point, and optionally a negative sign
			if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
				setLocalValue(newValue);
			}
		};

		const handleBlur = () => {
			setIsFocused(false);
			const parsedValue = parseCurrency(localValue);
			onChange(parsedValue);
			setLocalValue(formatCurrency(parsedValue));
		};

		const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
			setIsFocused(true);
			const rawValue = parseCurrency(localValue).toString();
			setLocalValue(rawValue);
			e.target.select();
		};

		return (
			<div className="space-y-2">
				<Label htmlFor={id}>{label}</Label>
				<input
					ref={inputRef}
					id={id}
					type="text"
					inputMode="decimal"
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					value={localValue}
					onChange={handleChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
				/>
			</div>
		);
	};

	// Calculate totals for each category
	useEffect(() => {
		setTradeInTotal(tradeIns.reduce((sum, item) => sum + item.value, 0));
		setAccessoriesTotal(accessories.reduce((sum, item) => sum + item.value, 0));
		setOffersRebatesTotal(
			offersRebates.reduce((sum, item) => sum + item.value, 0)
		);
		setProtectionPlansTotal(
			protectionPlans.reduce((sum, item) => sum + item.value, 0)
		);
		setSubscriptionsTotal(
			subscriptions.reduce((sum, item) => sum + item.value, 0)
		);
		setChargersTotal(chargers.reduce((sum, item) => sum + item.value, 0));
	}, [
		tradeIns,
		accessories,
		offersRebates,
		protectionPlans,
		subscriptions,
		chargers,
	]);

	// Calculate loan amount
	useEffect(() => {
		const calculatedLoanAmount =
			purchasePrice -
			downPayment -
			tradeInTotal +
			accessoriesTotal -
			offersRebatesTotal +
			protectionPlansTotal +
			subscriptionsTotal +
			chargersTotal;

		setLoanAmount(calculatedLoanAmount > 0 ? calculatedLoanAmount : 0);
	}, [
		purchasePrice,
		downPayment,
		tradeInTotal,
		accessoriesTotal,
		offersRebatesTotal,
		protectionPlansTotal,
		subscriptionsTotal,
		chargersTotal,
	]);

	// Calculate monthly payment
	useEffect(() => {
		if (loanAmount <= 0 || loanTerm <= 0 || apr <= 0) {
			setMonthlyPayment(0);
			return;
		}

		const monthlyRate = apr / 12 / 100;
		const monthlyPayment =
			(loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
			(Math.pow(1 + monthlyRate, loanTerm) - 1);

		setMonthlyPayment(monthlyPayment);
	}, [loanAmount, apr, loanTerm]);

	// Download as PDF
	const downloadAsPDF = async () => {
		if (!calculatorRef.current) return;

		try {
			// Dynamically import the libraries
			const html2canvas = (await import("html2canvas")).default;
			const { jsPDF } = await import("jspdf");

			const canvas = await html2canvas(calculatorRef.current, {
				scale: 2,
				logging: false,
				useCORS: true,
				allowTaint: true,
			});

			const imgData = canvas.toDataURL("image/jpeg", 1.0);
			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "px",
				format: [canvas.width, canvas.height],
			});

			pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
			pdf.save(
				`Car_Payment_Calculator_${new Date().toISOString().split("T")[0]}.pdf`
			);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Failed to generate PDF. Please try again.");
		}
	};

	// Download as JPG
	const downloadAsJPG = async () => {
		if (!calculatorRef.current) return;

		try {
			const html2canvas = (await import("html2canvas")).default;

			const canvas = await html2canvas(calculatorRef.current, {
				scale: 2,
				logging: false,
				useCORS: true,
				allowTaint: true,
			});

			const link = document.createElement("a");
			link.download = `Car_Payment_Calculator_${
				new Date().toISOString().split("T")[0]
			}.jpg`;
			link.href = canvas.toDataURL("image/jpeg", 1.0);
			link.click();
		} catch (error) {
			console.error("Error generating JPG:", error);
			alert("Failed to generate JPG. Please try again.");
		}
	};

	// Line Items Component for all items except Trade-ins
	const LineItemsSection = ({
		title,
		items,
		setItems,
		addItem,
		removeItem,
		updateItem,
		total,
		defaultOptions,
	}: {
		title: string;
		items: LineItem[];
		setItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
		addItem: () => void;
		removeItem: (id: string) => void;
		updateItem: (
			id: string,
			field: "name" | "value",
			value: string | number
		) => void;
		total: number;
		defaultOptions?: { name: string; value: number }[];
	}) => {
		const [selectedOption, setSelectedOption] = useState("");

		const handleAddDefault = () => {
			if (!selectedOption || !defaultOptions) return;

			const option = defaultOptions.find((opt) => opt.name === selectedOption);
			if (option) {
				const id = generateId();
				setItems([
					...items,
					{
						id,
						name: option.name,
						value: option.value,
					},
				]);
				setSelectedOption("");
			}
		};

		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-lg font-medium">{title}</h3>
					{defaultOptions ? (
						<div className="flex items-center gap-2">
							<select
								value={selectedOption}
								onChange={(e) => setSelectedOption(e.target.value)}
								className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="">Select {title}</option>
								{defaultOptions.map((option) => (
									<option key={option.name} value={option.name}>
										{option.name} ({formatCurrency(option.value)})
									</option>
								))}
							</select>
							<Button
								variant="outline"
								size="sm"
								onClick={handleAddDefault}
								disabled={!selectedOption}
								className="flex items-center gap-1"
							>
								<PlusCircle className="h-4 w-4" /> Add
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={addItem}
								className="flex items-center gap-1"
							>
								<PlusCircle className="h-4 w-4" /> Custom
							</Button>
						</div>
					) : (
						<Button
							variant="outline"
							size="sm"
							onClick={addItem}
							className="flex items-center gap-1"
						>
							<PlusCircle className="h-4 w-4" /> Add
						</Button>
					)}
				</div>

				{items.length === 0 ? (
					<p className="text-sm text-muted-foreground">No items added</p>
				) : (
					<div className="space-y-3">
						{items.map((item) => (
							<div key={item.id} className="flex gap-2 items-center">
								<div className="flex-1">
									<LineItemInput
										value={item.name}
										isCurrency={false}
										placeholder="Item name"
										onChange={(value) => updateItem(item.id, "name", value)}
									/>
								</div>
								<div className="w-32">
									<LineItemInput
										value={formatCurrency(item.value)}
										isCurrency={true}
										onChange={(value) => updateItem(item.id, "value", value)}
									/>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => removeItem(item.id)}
									className="h-9 w-9"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
						<div className="flex justify-between pt-2 border-t">
							<span className="font-medium">Total:</span>
							<span className="font-medium">{formatCurrency(total)}</span>
						</div>
					</div>
				)}
			</div>
		);
	};

	// Trade-in Items Component with Year/Make/Model fields
	const TradeInItemsSection = ({
		title,
		items,
		setItems,
		addItem,
		removeItem,
		updateItem,
		total,
	}: {
		title: string;
		items: LineItem[];
		setItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
		addItem: () => void;
		removeItem: (id: string) => void;
		updateItem: (
			id: string,
			field: "name" | "value",
			value: string | number
		) => void;
		total: number;
	}) => {
		const addVehicleTradeIn = () => {
			const id = generateId();
			setItems([
				...items,
				{
					id,
					name: "Vehicle Trade-in",
					value: 0,
				},
			]);
		};

		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-lg font-medium">{title}</h3>
					<Button
						variant="outline"
						size="sm"
						onClick={addVehicleTradeIn}
						className="flex items-center gap-1"
					>
						<PlusCircle className="h-4 w-4" /> Add Vehicle
					</Button>
				</div>

				{items.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No trade-in vehicles added
					</p>
				) : (
					<div className="space-y-4">
						{items.map((item) => (
							<div key={item.id} className="p-3 border rounded-md">
								<div className="flex justify-between mb-3">
									<h4 className="font-medium">Trade-in Details</h4>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeItem(item.id)}
										className="h-8 w-8"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
									<div>
										<Label
											htmlFor={`year-${item.id}`}
											className="text-xs block mb-1"
										>
											Year
										</Label>
										<select
											id={`year-${item.id}`}
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											onChange={(e) => {
												const year = e.target.value;
												const [make, model] = item.name.split(" - ").slice(1);
												const newName =
													year && make && model
														? `${year} - ${make} - ${model}`
														: item.name;
												updateItem(item.id, "name", newName);
											}}
											value={item.name.split(" - ")[0] || ""}
										>
											<option value="">Select Year</option>
											{years.map((year) => (
												<option key={year} value={year.toString()}>
													{year}
												</option>
											))}
										</select>
									</div>
									<div>
										<Label
											htmlFor={`make-${item.id}`}
											className="text-xs block mb-1"
										>
											Make
										</Label>
										<select
											id={`make-${item.id}`}
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											onChange={(e) => {
												const make = e.target.value;
												const nameParts = item.name.split(" - ");
												const year = nameParts[0];
												const newName =
													year && make
														? `${year} - ${make} - ${nameParts[2] || ""}`
														: item.name;
												updateItem(item.id, "name", newName);
											}}
											value={item.name.split(" - ")[1] || ""}
										>
											<option value="">Select Make</option>
											{Object.keys(carData).map((make) => (
												<option key={make} value={make}>
													{make}
												</option>
											))}
										</select>
									</div>
									<div>
										<Label
											htmlFor={`model-${item.id}`}
											className="text-xs block mb-1"
										>
											Model
										</Label>
										<select
											id={`model-${item.id}`}
											className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
											onChange={(e) => {
												const model = e.target.value;
												const nameParts = item.name.split(" - ");
												const year = nameParts[0];
												const make = nameParts[1];
												const newName =
													year && make && model
														? `${year} - ${make} - ${model}`
														: item.name;
												updateItem(item.id, "name", newName);
											}}
											value={item.name.split(" - ")[2] || ""}
										>
											<option value="">Select Model</option>
											{item.name.split(" - ")[1] &&
												carData[item.name.split(" - ")[1]]?.models.map(
													(model) => (
														<option key={model} value={model}>
															{model}
														</option>
													)
												)}
										</select>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Label
										htmlFor={`value-${item.id}`}
										className="whitespace-nowrap"
									>
										Trade-in Value:
									</Label>
									<LineItemInput
										value={formatCurrency(item.value)}
										isCurrency={true}
										onChange={(value) => updateItem(item.id, "value", value)}
									/>
								</div>
							</div>
						))}
						<div className="flex justify-between pt-2 border-t">
							<span className="font-medium">Total:</span>
							<span className="font-medium">{formatCurrency(total)}</span>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div ref={calculatorRef} className="bg-white p-6 rounded-lg">
			<Card className="w-full max-w-4xl mx-auto">
				<CardHeader>
					<div className="flex justify-between items-start">
						<div>
							<CardTitle>Car Payment Calculator</CardTitle>
							<CardDescription>
								Enter your car purchase details to calculate your monthly
								payment
							</CardDescription>
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={downloadAsPDF}
								className="flex items-center gap-1"
							>
								<Download className="h-4 w-4" /> PDF
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={downloadAsJPG}
								className="flex items-center gap-1"
							>
								<FileImage className="h-4 w-4" /> JPG
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="grid gap-6">
					{/* Vehicle Details */}
					<div className="space-y-2">
						<h3 className="text-lg font-medium">Vehicle Details</h3>
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div className="space-y-2">
								<Label htmlFor="vehicleYear">Year</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											role="combobox"
											className="w-full justify-between"
										>
											{vehicleYear || "Select Year"}
											<ChevronDown className="h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-full p-2" align="start">
										<div className="grid grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
											{years.map((year) => (
												<Button
													key={year}
													variant={
														vehicleYear === year.toString()
															? "default"
															: "outline"
													}
													size="sm"
													onClick={() => setVehicleYear(year.toString())}
													className="text-sm"
												>
													{year}
												</Button>
											))}
										</div>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<Label htmlFor="vehicleMake">Make</Label>
								<select
									id="vehicleMake"
									value={vehicleMake}
									onChange={(e) => setVehicleMake(e.target.value)}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">Select Make</option>
									{Object.keys(carData).map((make) => (
										<option key={make} value={make}>
											{make}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="vehicleModel">Model</Label>
								<select
									id="vehicleModel"
									value={vehicleModel}
									onChange={(e) => setVehicleModel(e.target.value)}
									disabled={!vehicleMake}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">Select Model</option>
									{availableModels.map((model) => (
										<option key={model} value={model}>
											{model}
										</option>
									))}
								</select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="vehicleTrim">Trim</Label>
								<select
									id="vehicleTrim"
									value={vehicleTrim}
									onChange={(e) => setVehicleTrim(e.target.value)}
									disabled={!vehicleModel}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">Select Trim</option>
									{availableTrims.map((trim) => (
										<option key={trim} value={trim}>
											{trim}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Basic Purchase Details */}
					<div className="space-y-2">
						<h3 className="text-lg font-medium">Purchase Details</h3>
						<div className="grid grid-cols-1 gap-4">
							<CurrencyInput
								id="purchasePrice"
								value={purchasePrice}
								onChange={setPurchasePrice}
								label="Purchase Price"
							/>
							<div className="space-y-4">
								<div className="flex justify-between">
									<Label htmlFor="downPayment">Down Payment</Label>
									<span className="text-sm font-medium">
										{formatCurrency(downPayment)}
									</span>
								</div>
								<Slider
									id="downPayment"
									min={0}
									max={Math.max(purchasePrice * 0.5, 1000)}
									step={100}
									value={[downPayment]}
									onValueChange={(value) => setDownPayment(value[0])}
									className="py-4"
								/>
								<div className="flex justify-between text-xs text-muted-foreground">
									<span>{formatCurrency(0)}</span>
									<span>
										{formatCurrency(Math.max(purchasePrice * 0.5, 1000))}
									</span>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
							<div className="space-y-2">
								<Label htmlFor="apr">APR (%)</Label>
								<Input
									id="apr"
									type="number"
									step="0.01"
									min="0"
									value={apr}
									onChange={(e) =>
										setApr(Number.parseFloat(e.target.value) || 0)
									}
									onFocus={(e) => e.target.select()}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="loanTerm">Loan Term (months)</Label>
								<div className="grid grid-cols-4 gap-2">
									{[24, 32, 40, 48, 56, 64, 72, 80].map((term) => (
										<Button
											key={term}
											type="button"
											variant={loanTerm === term ? "default" : "outline"}
											size="sm"
											onClick={() => setLoanTerm(term)}
											className="w-full"
										>
											{term}
										</Button>
									))}
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Line Items Stacked Layout */}
					<div className="space-y-6">
						<h3 className="text-lg font-medium">Line Items</h3>

						<div className="space-y-8">
							{/* Trade-ins */}
							<div className="p-4 border rounded-lg">
								<TradeInItemsSection
									title="Trade-in Vehicles"
									items={tradeIns}
									setItems={setTradeIns}
									addItem={() => {}}
									removeItem={(id) => removeLineItem(id, tradeIns, setTradeIns)}
									updateItem={(id, field, value) => {
										if (field === "name") {
											// Directly update the state with the new name
											const updatedItems = tradeIns.map((item) =>
												item.id === id
													? { ...item, name: value as string }
													: item
											);
											setTradeIns(updatedItems);
										} else {
											// Handle value updates
											updateItemValue(
												id,
												value as string,
												tradeIns,
												setTradeIns
											);
										}
									}}
									total={tradeInTotal}
								/>
							</div>

							{/* Accessories */}
							<div className="p-4 border rounded-lg">
								<LineItemsSection
									title="Accessories"
									items={accessories}
									setItems={setAccessories}
									addItem={() =>
										addLineItem(accessories, setAccessories, "Accessory")
									}
									removeItem={(id) =>
										removeLineItem(id, accessories, setAccessories)
									}
									updateItem={(id, field, value) => {
										if (field === "name") {
											// Directly update the state with the new name
											const updatedItems = accessories.map((item) =>
												item.id === id
													? { ...item, name: value as string }
													: item
											);
											setAccessories(updatedItems);
										} else {
											// Handle value updates
											updateItemValue(
												id,
												value as string,
												accessories,
												setAccessories
											);
										}
									}}
									total={accessoriesTotal}
									defaultOptions={createDefaultAccessories()}
								/>
							</div>

							{/* Offers & Rebates */}
							<div className="p-4 border rounded-lg">
								<LineItemsSection
									title="Offers & Rebates"
									items={offersRebates}
									setItems={setOffersRebates}
									addItem={() =>
										addLineItem(offersRebates, setOffersRebates, "Rebate")
									}
									removeItem={(id) =>
										removeLineItem(id, offersRebates, setOffersRebates)
									}
									updateItem={(id, field, value) => {
										if (field === "name") {
											// Directly update the state with the new name
											const updatedItems = offersRebates.map((item) =>
												item.id === id
													? { ...item, name: value as string }
													: item
											);
											setOffersRebates(updatedItems);
										} else {
											// Handle value updates
											updateItemValue(
												id,
												value as string,
												offersRebates,
												setOffersRebates
											);
										}
									}}
									total={offersRebatesTotal}
									defaultOptions={createDefaultOffersRebates()}
								/>
							</div>

							{/* Protection Plans */}
							<div className="p-4 border rounded-lg">
								<LineItemsSection
									title="Protection Plans"
									items={protectionPlans}
									setItems={setProtectionPlans}
									addItem={() =>
										addLineItem(
											protectionPlans,
											setProtectionPlans,
											"Protection Plan"
										)
									}
									removeItem={(id) =>
										removeLineItem(id, protectionPlans, setProtectionPlans)
									}
									updateItem={(id, field, value) => {
										if (field === "name") {
											// Directly update the state with the new name
											const updatedItems = protectionPlans.map((item) =>
												item.id === id
													? { ...item, name: value as string }
													: item
											);
											setProtectionPlans(updatedItems);
										} else {
											// Handle value updates
											updateItemValue(
												id,
												value as string,
												protectionPlans,
												setProtectionPlans
											);
										}
									}}
									total={protectionPlansTotal}
									defaultOptions={createDefaultProtectionPlans()}
								/>
							</div>

							{/* Subscriptions */}
							<div className="p-4 border rounded-lg">
								<LineItemsSection
									title="Subscriptions"
									items={subscriptions}
									setItems={setSubscriptions}
									addItem={() =>
										addLineItem(subscriptions, setSubscriptions, "Subscription")
									}
									removeItem={(id) =>
										removeLineItem(id, subscriptions, setSubscriptions)
									}
									updateItem={(id, field, value) => {
										if (field === "name") {
											// Directly update the state with the new name
											const updatedItems = subscriptions.map((item) =>
												item.id === id
													? { ...item, name: value as string }
													: item
											);
											setSubscriptions(updatedItems);
										} else {
											// Handle value updates
											updateItemValue(
												id,
												value as string,
												subscriptions,
												setSubscriptions
											);
										}
									}}
									total={subscriptionsTotal}
									defaultOptions={createDefaultSubscriptions()}
								/>
							</div>

							{/* Chargers */}
							<div className="p-4 border rounded-lg">
								<LineItemsSection
									title="Chargers"
									items={chargers}
									setItems={setChargers}
									addItem={() => addLineItem(chargers, setChargers, "Charger")}
									removeItem={(id) => removeLineItem(id, chargers, setChargers)}
									updateItem={(id, field, value) => {
										if (field === "name") {
											// Directly update the state with the new name
											const updatedItems = chargers.map((item) =>
												item.id === id
													? { ...item, name: value as string }
													: item
											);
											setChargers(updatedItems);
										} else {
											// Handle value updates
											updateItemValue(
												id,
												value as string,
												chargers,
												setChargers
											);
										}
									}}
									total={chargersTotal}
									defaultOptions={createDefaultChargers()}
								/>
							</div>
						</div>
					</div>

					<Separator className="my-2" />

					{/* Summary */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Summary</h3>

						<Accordion
							type="multiple"
							className="w-full"
							defaultValue={["overview"]}
						>
							<AccordionItem value="overview">
								<AccordionTrigger className="text-base font-medium">
									Overview
								</AccordionTrigger>
								<AccordionContent>
									<div className="grid grid-cols-2 gap-x-4 gap-y-2 py-2">
										<div className="text-sm">Purchase Price:</div>
										<div className="text-sm text-right">
											{formatCurrency(purchasePrice)}
										</div>

										<div className="text-sm">Down Payment:</div>
										<div className="text-sm text-right">
											-{formatCurrency(downPayment)}
										</div>

										<div className="text-sm">Trade-in Value:</div>
										<div className="text-sm text-right">
											-{formatCurrency(tradeInTotal)}
										</div>

										<div className="text-sm">Accessories:</div>
										<div className="text-sm text-right">
											+{formatCurrency(accessoriesTotal)}
										</div>

										<div className="text-sm">Offers & Rebates:</div>
										<div className="text-sm text-right">
											-{formatCurrency(offersRebatesTotal)}
										</div>

										<div className="text-sm">Protection Plans:</div>
										<div className="text-sm text-right">
											+{formatCurrency(protectionPlansTotal)}
										</div>

										<div className="text-sm">Subscriptions:</div>
										<div className="text-sm text-right">
											+{formatCurrency(subscriptionsTotal)}
										</div>

										<div className="text-sm">Chargers:</div>
										<div className="text-sm text-right">
											+{formatCurrency(chargersTotal)}
										</div>

										<div className="text-base font-medium pt-2 border-t">
											Loan Amount:
										</div>
										<div className="text-base font-medium text-right pt-2 border-t">
											{formatCurrency(loanAmount)}
										</div>
									</div>
								</AccordionContent>
							</AccordionItem>

							{tradeIns.length > 0 && (
								<AccordionItem value="trade-ins">
									<AccordionTrigger className="text-base">
										Trade-ins (-{formatCurrency(tradeInTotal)})
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-2 py-2">
											{tradeIns.map((item) => (
												<div key={item.id} className="flex justify-between">
													<span className="text-sm">{item.name}</span>
													<span className="text-sm">
														{formatCurrency(item.value)}
													</span>
												</div>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							)}

							{accessories.length > 0 && (
								<AccordionItem value="accessories">
									<AccordionTrigger className="text-base">
										Accessories (+{formatCurrency(accessoriesTotal)})
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-2 py-2">
											{accessories.map((item) => (
												<div key={item.id} className="flex justify-between">
													<span className="text-sm">{item.name}</span>
													<span className="text-sm">
														{formatCurrency(item.value)}
													</span>
												</div>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							)}

							{offersRebates.length > 0 && (
								<AccordionItem value="offers-rebates">
									<AccordionTrigger className="text-base">
										Offers & Rebates (-{formatCurrency(offersRebatesTotal)})
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-2 py-2">
											{offersRebates.map((item) => (
												<div key={item.id} className="flex justify-between">
													<span className="text-sm">{item.name}</span>
													<span className="text-sm">
														{formatCurrency(item.value)}
													</span>
												</div>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							)}

							{protectionPlans.length > 0 && (
								<AccordionItem value="protection-plans">
									<AccordionTrigger className="text-base">
										Protection Plans (+{formatCurrency(protectionPlansTotal)})
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-2 py-2">
											{protectionPlans.map((item) => (
												<div key={item.id} className="flex justify-between">
													<span className="text-sm">{item.name}</span>
													<span className="text-sm">
														{formatCurrency(item.value)}
													</span>
												</div>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							)}

							{subscriptions.length > 0 && (
								<AccordionItem value="subscriptions">
									<AccordionTrigger className="text-base">
										Subscriptions (+{formatCurrency(subscriptionsTotal)})
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-2 py-2">
											{subscriptions.map((item) => (
												<div key={item.id} className="flex justify-between">
													<span className="text-sm">{item.name}</span>
													<span className="text-sm">
														{formatCurrency(item.value)}
													</span>
												</div>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							)}

							{chargers.length > 0 && (
								<AccordionItem value="chargers">
									<AccordionTrigger className="text-base">
										Chargers (+{formatCurrency(chargersTotal)})
									</AccordionTrigger>
									<AccordionContent>
										<div className="space-y-2 py-2">
											{chargers.map((item) => (
												<div key={item.id} className="flex justify-between">
													<span className="text-sm">{item.name}</span>
													<span className="text-sm">
														{formatCurrency(item.value)}
													</span>
												</div>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							)}
						</Accordion>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="loanAmount">Loan Amount</Label>
								<div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm align-middle items-center">
									{formatCurrency(loanAmount)}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex flex-col">
					<div className="w-full p-4 bg-muted rounded-lg">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Monthly Payment:</h3>
							<span className="text-2xl font-bold">
								{formatCurrency(monthlyPayment)}
							</span>
						</div>
					</div>
					<p className="text-xs text-muted-foreground mt-4">
						This calculator provides an estimate. Actual payment may vary based
						on taxes, fees, and other factors.
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
