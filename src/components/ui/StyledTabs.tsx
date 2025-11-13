import { styled, Tabs } from "@mui/material";

interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    variant?: "standard" | "scrollable" | "fullWidth";
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const GROUP_BORDER = "#d3d3d3ff";

const StyledTabs = styled((props: StyledTabsProps) => (
    <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))(({ theme }) => ({
    backgroundColor: "#fff",
    padding: 6,               // tighter padding so the group border sits close
    border: `1px solid ${GROUP_BORDER}`,
    borderRadius: 12,
    minHeight: 44,
    // hide default indicator
    "& .MuiTabs-indicator, & .MuiTabs-indicatorSpan": {
        display: "none",
    },
    // ensure children fill height
    ".MuiTabs-flexContainer": {
        alignItems: "stretch",
    },
}));

export default StyledTabs;
