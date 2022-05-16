import React, {useEffect, useMemo, useState} from "react";
import styleModule from './Paginator.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAnglesRight} from '@fortawesome/free-solid-svg-icons/faAnglesRight';
import {faAnglesLeft} from '@fortawesome/free-solid-svg-icons/faAnglesLeft';
import Select from '../Select/Select';
import {getPacksByPage, setPageCount} from '../../../bll/packs/packs-reducer';
import {useAppDispatch, useAppSelector} from '../../../bll/hooks';

export type PaginatorPropsType = {
    portionSize: number
    currentPage?: number
    pageSize?: number
    totalItemsCount?: number
    onChangePage?: (pageNumber: number) => void
    onChangePageSize?: (pageSize: number) => void
}

export const Paginator = React.memo(({portionSize = 12, ...props}: PaginatorPropsType) => {
    const dispatch = useAppDispatch();
    const cardPacksTotalCount = useAppSelector(state => state.packs.cardPacksTotalCount);
    const pageStateCount = useAppSelector(state => state.packs.params.pageCount);
    const currentStatePage = useAppSelector(state => state.packs.params.page);
    const params = useAppSelector(state => state.packs.params);
    const {pageCount, pages} = useMemo(() => {
        let pages: Array<number> = [];
        let pageCount: number;
        pageCount = Math.ceil(cardPacksTotalCount / pageStateCount)

        for (let i = 1; i <= pageCount; i++) {
            pages.push(i)
        }
        return {pageCount, pages}


    }, [cardPacksTotalCount, pageStateCount]);

    const itemsCounts = [10, 20, 30, 40, 50, 100];

    let [portionNumber, setPortionNumber] = useState<number>(1);
    const portionCount: number = Math.ceil(pageCount / portionSize);
    let leftPortionPageNumber: number = useMemo(() => {
        return portionSize * (portionNumber - 1) + 1
    }, [portionSize,
        portionNumber])
    const rightPortionPageNumber: number = useMemo(() => {
        return portionSize * portionNumber;
    }, [portionSize, portionNumber]);
    useEffect(() => {
        if (currentStatePage === 1) {
            setPortionNumber(1)
        }
    }, [params])
    const onChangePage = (pageNumber: number) => {
        dispatch(getPacksByPage(pageNumber))
    };
    const onChangePageSize = (pageCount: number) => {
        dispatch(setPageCount(pageCount));
    };

    return (
        <div className={styleModule.paginator}>
            {portionNumber > 1 && <span className={styleModule.firstPage} onClick={() => {
                setPortionNumber(1)
            }}>{"First"}</span>}
            {portionNumber > 1 && <span className={styleModule.pagesToBack} onClick={() => {
                setPortionNumber(portionNumber - 1)
            }}>
                <FontAwesomeIcon icon={faAnglesLeft}/>
            </span>}
            {portionNumber > 1 && <span className={styleModule.threeDots}>{"..."}</span>}

            {pages.filter(page => page >= leftPortionPageNumber && page <= rightPortionPageNumber)
                .map(page => <span key={page}
                                   className={currentStatePage === page ? `${styleModule.pageNumber} ${styleModule.selectedPageNumber}` : styleModule.pageNumber}
                                   onClick={() => {
                                       onChangePage(page)
                                   }}>{page}</span>
                )}

            {portionNumber < portionCount && <span className={styleModule.threeDots}>{"..."}</span>}
            {portionNumber < portionCount && <span className={styleModule.pagesToForward} onClick={() => {
                setPortionNumber(portionNumber + 1)
            }}>
                <FontAwesomeIcon icon={faAnglesRight}/>
            </span>}
            {portionNumber < portionCount && <span className={styleModule.lastPage} onClick={() => {
                setPortionNumber(portionNumber = portionCount)
            }}>{"Last"}</span>}
            <div className={styleModule.pageCountSettings}>
                Show
                <span className={styleModule.select}>
                <Select options={itemsCounts}
                        value={props.pageSize}
                        onChangeOption={onChangePageSize}/>
                </span>
                items per page
            </div>
        </div>
    );
});