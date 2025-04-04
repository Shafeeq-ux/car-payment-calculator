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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Define types for our line items
type LineItem = {
	id: string;
	name: string;
	value: number;
};

// Car make and model data
const carData = {
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

	// Generate a unique ID
	const generateId = () => {
		return Math.random().toString(36).substring(2, 9);
	};

	// Add a new line item
	const addLineItem = (
		items: LineItem[],
		setItems: React.Dispatch<React.SetStateAction<LineItem[]>>,
		defaultName = ""
	) => {
		const newItem = {
			id: generateId(),
			name: defaultName,
			value: 0,
		};
		setItems([...items, newItem]);
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
		// Important: Don't overwrite existing item values
		const updatedItems = items.map((item) => {
			if (item.id === id) {
				return { ...item, name: name };
			}
			return item;
		});
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

		// Update local value when prop changes
		useEffect(() => {
			if (!isFocused) {
				setLocalValue(value);
			}
		}, [value, isFocused]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;

			// If currency, only allow numbers, decimal point, and optionally a negative sign
			if (isCurrency) {
				// Allow numbers, a single decimal point, and nothing else
				// Empty string is allowed to clear the field
				if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
					setLocalValue(newValue);
				}
			} else {
				// For non-currency fields (names), always update the local value
				setLocalValue(newValue);
				// Immediately notify parent for non-currency fields
				onChange(newValue);
			}
		};

		const handleBlur = () => {
			setIsFocused(false);
			if (isCurrency) {
				const parsedValue = parseCurrency(localValue);
				const currencyValue = formatCurrency(parsedValue);
				setLocalValue(currencyValue);
				onChange(currencyValue);
			} else {
				// Ensure parent gets final value on blur for name fields
				onChange(localValue);
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
				type={isCurrency ? "text" : "text"}
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

	// Line Items Component
	const LineItemsSection = ({
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
	}) => (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-lg font-medium">{title}</h3>
				<Button
					variant="outline"
					size="sm"
					onClick={addItem}
					className="flex items-center gap-1"
				>
					<PlusCircle className="h-4 w-4" /> Add
				</Button>
			</div>

			{items.length === 0 ? (
				<p className="text-sm text-muted-foreground">No items added</p>
			) : (
				<div className="space-y-3">
					{items.map((item) => (
						<div key={item.id} className="flex gap-2 items-center">
							<div className="flex-1">
								<input
									type="text"
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									value={item.name}
									placeholder="Item name"
									onChange={(e) => updateItem(item.id, "name", e.target.value)}
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
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<CurrencyInput
								id="purchasePrice"
								value={purchasePrice}
								onChange={setPurchasePrice}
								label="Purchase Price"
							/>
							<CurrencyInput
								id="downPayment"
								value={downPayment}
								onChange={setDownPayment}
								label="Down Payment"
							/>
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
								<Input
									id="loanTerm"
									type="number"
									min="1"
									value={loanTerm}
									onChange={(e) =>
										setLoanTerm(Number.parseInt(e.target.value) || 0)
									}
									onFocus={(e) => e.target.select()}
								/>
							</div>
						</div>
					</div>

					<Separator />

					{/* Line Items Tabs */}
					<Tabs defaultValue="tradeIns" className="w-full">
						<TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
							<TabsTrigger
								value="tradeIns"
								onClick={(e) => e.stopPropagation()}
							>
								Trade-ins
							</TabsTrigger>
							<TabsTrigger
								value="accessories"
								onClick={(e) => e.stopPropagation()}
							>
								Accessories
							</TabsTrigger>
							<TabsTrigger
								value="offersRebates"
								onClick={(e) => e.stopPropagation()}
							>
								Offers & Rebates
							</TabsTrigger>
							<TabsTrigger
								value="protectionPlans"
								onClick={(e) => e.stopPropagation()}
							>
								Protection Plans
							</TabsTrigger>
							<TabsTrigger
								value="subscriptions"
								onClick={(e) => e.stopPropagation()}
							>
								Subscriptions
							</TabsTrigger>
							<TabsTrigger
								value="chargers"
								onClick={(e) => e.stopPropagation()}
							>
								Chargers
							</TabsTrigger>
						</TabsList>

						<TabsContent value="tradeIns">
							<LineItemsSection
								title="Trade-in Vehicles"
								items={tradeIns}
								setItems={setTradeIns}
								addItem={() => addLineItem(tradeIns, setTradeIns, "Vehicle")}
								removeItem={(id) => removeLineItem(id, tradeIns, setTradeIns)}
								updateItem={(id, field, value) => {
									if (field === "name") {
										updateItemName(id, value as string, tradeIns, setTradeIns);
									} else {
										updateItemValue(id, value as string, tradeIns, setTradeIns);
									}
								}}
								total={tradeInTotal}
							/>
						</TabsContent>

						<TabsContent value="accessories">
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
										updateItemName(
											id,
											value as string,
											accessories,
											setAccessories
										);
									} else {
										updateItemValue(
											id,
											value as string,
											accessories,
											setAccessories
										);
									}
								}}
								total={accessoriesTotal}
							/>
						</TabsContent>

						<TabsContent value="offersRebates">
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
										updateItemName(
											id,
											value as string,
											offersRebates,
											setOffersRebates
										);
									} else {
										updateItemValue(
											id,
											value as string,
											offersRebates,
											setOffersRebates
										);
									}
								}}
								total={offersRebatesTotal}
							/>
						</TabsContent>

						<TabsContent value="protectionPlans">
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
										updateItemName(
											id,
											value as string,
											protectionPlans,
											setProtectionPlans
										);
									} else {
										updateItemValue(
											id,
											value as string,
											protectionPlans,
											setProtectionPlans
										);
									}
								}}
								total={protectionPlansTotal}
							/>
						</TabsContent>

						<TabsContent value="subscriptions">
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
										updateItemName(
											id,
											value as string,
											subscriptions,
											setSubscriptions
										);
									} else {
										updateItemValue(
											id,
											value as string,
											subscriptions,
											setSubscriptions
										);
									}
								}}
								total={subscriptionsTotal}
							/>
						</TabsContent>

						<TabsContent value="chargers">
							<LineItemsSection
								title="Chargers"
								items={chargers}
								setItems={setChargers}
								addItem={() => addLineItem(chargers, setChargers, "Charger")}
								removeItem={(id) => removeLineItem(id, chargers, setChargers)}
								updateItem={(id, field, value) => {
									if (field === "name") {
										updateItemName(id, value as string, chargers, setChargers);
									} else {
										updateItemValue(id, value as string, chargers, setChargers);
									}
								}}
								total={chargersTotal}
							/>
						</TabsContent>
					</Tabs>

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
