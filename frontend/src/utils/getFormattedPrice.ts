export const getFormattedPrice = (price: {
	currency?: string;
	amount?: number;
}) => {
	const currencyCode = price.currency;
	const amount = (price.amount / 100).toString();
	return `${new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: currencyCode,
		currencyDisplay: "narrowSymbol",
	}).format(Number.parseFloat(amount))}`;
};
