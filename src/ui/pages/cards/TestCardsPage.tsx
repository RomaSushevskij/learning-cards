import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../bll/hooks';
import {Navigate, useParams} from 'react-router-dom';
import {PATH} from '../../routes/RoutesApp';
import {Paginator} from '../../common/Paginator/Paginator';
import {addCardTC, cardsActions, getCardsTC} from '../../../bll/cards/cards-reducer';
import style from './TestCardsPage.module.scss'
import paperStyle from '../../common/styles/classes.module.scss';
import {Skeleton} from '../../common/Skeleton/Skeleton';
import {InputTextSecondary} from '../../common/InputTextSecondary/InputTextSecondary';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSortUp} from '@fortawesome/free-solid-svg-icons/faSortUp';
import {Radio} from '../../common/Radio/Radio';
import {TestCard} from './TestCard/TestCard';
import {ButtonSecondary} from '../../common/ButtonSecondary/ButtonSecondary';

enum SEARCH_BY_TYPES {
    BY_QUESTIONS = 'Questions',
    BY_ANSWERS = 'Answers'
}

export const TestCardsPage = () => {
    const cards = useAppSelector(state => state.cards.cards);
    const userId = useAppSelector(state => state.profile.user._id);
    const userPackId = useAppSelector(state => state.cards.packUserId)
    const params = useAppSelector(state => state.cards.params);
    const isLoggedIn = useAppSelector(state => state.login.isLoggedIn);
    const isAppFetching = useAppSelector(state => state.app.isAppFetching);
    const dispatch = useAppDispatch();

    const [sortParams, setSortParams] = useState<boolean>(false);
    const [modalActive, setModalActive] = useState<boolean>(false);
    const [cardQuestion, setCardQuestion] = useState<string>('');
    const [cardAnswer, setCardAnswer] = useState<string>('');

    const [questionValue, setQuestionValue] = useState<string>('');
    const [answerValue, setAnswerValue] = useState<string>('');

    //sings for cards searching
    const singsSearch = [SEARCH_BY_TYPES.BY_QUESTIONS, SEARCH_BY_TYPES.BY_ANSWERS];
    const [singCardsSearch, setSingCardsSearch] = useState<SEARCH_BY_TYPES>(singsSearch[0]);

    const urlParams = useParams<'*'>() as { '*': string };
    const cardsPack_id = urlParams['*'];


    useEffect(() => {
        dispatch(getCardsTC(cardsPack_id));
    }, [params.sortCards, params.cardAnswer, params.cardQuestion]);


    const addCardHandler = () => {
        dispatch(addCardTC({
            card: {
                cardsPack_id,
                question: cardQuestion,
                answer: cardAnswer,
            },
        }));
        setModalActive(false);
    };

    const sortHandler = (e: any) => {
        if (e.target.dataset) {
            const trigger = e.currentTarget.dataset.sort;
            dispatch(cardsActions.setSortCards(`${Number(sortParams)}${trigger}`));
            setSortParams(!sortParams);
        }
    };
    const onChangePage = (pageNumber: number) => {

    };
    const onChangePageSize = (pageCount: number) => {

    };

    const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const trigger = e.currentTarget.dataset.input;
        if (e.code === 'Enter') {
            if (trigger === 'searchQuestion') {
                dispatch(cardsActions.setQuestionSearch(questionValue));
            } else {
                dispatch(cardsActions.setAnswerSearch(answerValue));
            }
        }
    };
    const isMyPack = userId === userPackId;

    if (!isLoggedIn) {
        return <Navigate to={PATH.LOGIN}/>;
    }
    return (
        <div className={style.cardsWrapper}>
            <div className={`${style.cardsContainer} ${paperStyle.shadowPaper}`} data-z="paper">
                {isAppFetching && <Skeleton/>}
                <div className={style.settingsBlock}>
                    <div className={style.radioBlock}>
                        <h4>Search cards by:</h4>
                        <Radio
                            name={'radio'}
                            options={singsSearch}
                            value={singCardsSearch}
                            onChangeOption={setSingCardsSearch}
                        />
                    </div>
                    <div className={style.inputBlock}>
                        <InputTextSecondary type='text'
                                            value={''}
                                            onChange={() => {
                                            }}
                                            placeholder={'Search'}
                                            className={style.input}/>
                    </div>
                    {isMyPack && <div className={style.button}>
                        <ButtonSecondary className={style.primaryButton}
                                         onClick={() => setModalActive(true)}>
                            Add card
                        </ButtonSecondary>
                    </div>}
                </div>
                <div className={style.tableBlock}>
                    <table>
                        <thead>
                        <tr>
                            <th
                                data-sort='question'
                                className={style.questionCol}>
                                Question &ensp;
                                <FontAwesomeIcon icon={faSortUp}/>
                            </th>
                            <th
                                data-sort='answer'
                                className={style.answerCol}>
                                Answer &ensp;
                                <FontAwesomeIcon icon={faSortUp}/>
                            </th>
                            <th
                                data-sort='updated'
                                className={style.updatedCol}>
                                Last Updated &ensp;
                                <FontAwesomeIcon icon={faSortUp}/>
                            </th>
                            <th
                                data-sort='grade'
                                className={style.gradeCol}>
                                Grade &ensp;
                                <FontAwesomeIcon icon={faSortUp}/>
                            </th>
                            {isMyPack &&
                            <th className={style.actions}>
                                Actions
                            </th>}
                        </tr>
                        </thead>
                        <tbody>
                        {cards.map(card => <TestCard key={card._id} card={card}
                                                     cardsPack_id={cardsPack_id}
                                                     userPackId={userPackId}
                        />)}
                        </tbody>
                    </table>
                </div>
                <div className={style.paginationBlock}>
                    <Paginator portionSize={5}
                               currentPage={1}
                               pageSize={10}
                               totalItemsCount={50}
                               onChangePage={onChangePage}
                               onChangePageSize={onChangePageSize}/>

                </div>
            </div>


        </div>

    );
};
