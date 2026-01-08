type IconNextProps = React.SVGProps<SVGSVGElement> & {
	size?: number;
};

export default function IconNext({ size = 40, color = '#cfcfcf' }: IconNextProps) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke={color} stroke-miterlimit="10" stroke-width="1.91px" cx="12" cy="12" r="10.5"/><polygon fill="none" stroke={color} stroke-miterlimit="10" stroke-width="1.91px" points="14.86 12 8.18 15.82 8.18 8.18 14.86 12"/><line fill="none" stroke={color} stroke-miterlimit="10" stroke-width="1.91px" x1="15.82" y1="7.23" x2="15.82" y2="16.77"/></svg>
	);
};