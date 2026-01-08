type IconRemoveProps = React.SVGProps<SVGSVGElement> & {
	size?: number;
};

export default function IconRemove({ size = 16, color = '#fff' }: IconRemoveProps) {
	return (
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width={size} height={size} viewBox="0 0 16 16" enableBackground="new 0 0 16 16"><line fill="none" stroke={color} strokeWidth="4px" x1="0.438" y1="0.438" x2="15.5" y2="15.5"/><line fill="none" stroke={color} strokeWidth="4px" x1="15.5" y1="0.438" x2="0.438" y2="15.5"/></svg>
	);
};