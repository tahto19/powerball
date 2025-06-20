//@ts-nocheck
import CustomizedDataGrid from "../CustomizedDataGrid.tsx";
import { paginationModel, columnHeader2 } from "./DataGridDetails.ts";

const Participants = (raffle_schedule_id: { raffle_schedule_id: number }) => {
    return (
        <>
            <CustomizedDataGrid
                sx={{
                    width: "50%",
                    margin: "0 auto",
                }}
                loading={false}
                isAction={false}
                data={[]}
                headers={columnHeader2}
                pagination={paginationModel}
                checkboxSelection={false}
            />
        </>
    )
}

export default Participants;