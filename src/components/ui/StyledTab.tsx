import { styled, Tab } from "@mui/material";

interface StyledTabProps {
    label: string;
}

const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        position: "relative", // needed for separator pseudo-element
        textTransform: "none",
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: theme.typography.pxToRem(15),
        minHeight: 40,
        padding: "8px 22px",
        minWidth: 120,
        color: theme.palette.grey[800],
        // separator line (thin) — no full borders on the tab itself
        "&:not(:last-of-type)::after": {
            content: '""',
            position: "absolute",
            right: 0,
            top: "14%",
            height: "72%",
            width: 1,
            background: '#d3d3d3ff',
        },
        // small hover
        "&:hover": {
            backgroundColor: "rgba(0,0,0,0.02)",
        },

        /* ========== Selected state ========== */
        // general selected styles
        "&.Mui-selected": {
            color: 'primary',
            // Use outline so the visual stroke overlaps the group border but does not change layout
            outlineOffset: -1,
            zIndex: 2,
        },

        // selected + first tab => round left corners (so it matches container)
        "&.Mui-selected:first-of-type": {
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
        },

        // selected + last tab => round right corners
        "&.Mui-selected:last-of-type": {
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
        },

        // selected middle tab => no external rounding (looks flush between neighbors)
        "&.Mui-selected:not(:first-of-type):not(:last-of-type)": {
            borderRadius: 0,
        },

        // focus ring
        "&.Mui-focusVisible": {
            boxShadow: `0 0 0 3px ${theme.palette.action.focus}`,
        },
    })
);

export default StyledTab;