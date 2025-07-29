//@ts-nocheck
import CustomizedDataGrid from "../CustomizedDataGrid.tsx";
import { paginationModel, columnHeader2 } from "./DataGridDetails.ts";

import { useState } from "react";
import { useAppSelector } from "@/redux/hook";


import { bodyDecrypt } from "@/utils/util";
import apiService from "@/services/apiService";
import { RafflePaginationState } from '@/components/GameMaintenance/interface.ts';

import { showToaster } from "@/redux/reducers/global/globalSlice"

const initialPaginationData = { page: 0, pageSize: 10 }

const Participants = ({ raffle_schedule_id }: { raffle_schedule_id: number }) => {
    const { token } = useAppSelector((state) => state.token);
    const [list, setList] = useState<[]>([]);
    const [listCount, setListCount] = useState<number>(0);
    const [pagination, setPagination] = useState(initialPaginationData);

    const handleTableChange = async ({ page, pageSize, sortModel, filterModel }: any) => {
        setPagination({ page, pageSize })

        let sort = [['id', 'DESC']];
        if (sortModel.length > 0) {
            sort = [[sortModel[0].field, sortModel[0].sort.toUpperCase()]];
        }

        let newFilterModel = [];

        if (filterModel.items.length > 0) {
            newFilterModel = JSON.parse(JSON.stringify(filterModel)).items.map((x: any) => {
                x.filter = x.value;
                x.type = 'string';

                delete x.value;
                delete x.fromInput;
                delete x.id;
                delete x.operator;
                return x;
            })
        }
        const query: RafflePaginationState = {
            id: raffle_schedule_id, offset: page, limit: pageSize, sort: sort, filter: newFilterModel
        }

        const res = await apiService.getParticipantByRaffle(query, token);

        const d = bodyDecrypt(res.data, token)
        if (d.list && d.list.length > 0) {
            d.list = d.list.map((x, i) => { x.id = i + 1; return x })
            setList(d.list)

            setListCount(d.count)
        }
    };

    return (
        <>
            <CustomizedDataGrid
                sx={{
                    width: "100%",
                }}
                loading={false}
                data={list}
                headers={columnHeader2}
                pagination={paginationModel}
                pageLength={listCount}
                isAction={false}
                onTableChange={handleTableChange}
            />
        </>
    )
}

export default Participants;