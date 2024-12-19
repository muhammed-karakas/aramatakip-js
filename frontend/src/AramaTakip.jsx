import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button, ConfigProvider, Layout, message, Spin, theme, Typography } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import DisplayPanel from './components/DisplayPanel';
import InputPanel from './components/InputPanel';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AramaTakip = () => {
    const [headerFooterHeight, setHeaderFooterHeight] = useState(Math.max(window.innerHeight * 0.08, 30));
    const [nameOptions, setNameOptions] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState('today');
    const [name, setName] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'light');
    const panelRef = useRef(null);

    const updateHeights = () => {
        setHeaderFooterHeight(Math.max(window.innerHeight * 0.08, 30));
    };

    const calculatePageSize = () => {
        if (panelRef.current) {
            const availableHeight = panelRef.current.clientHeight - 120;
            const rowHeight = 60;
            const calculatedPageSize = Math.max(3, Math.floor(availableHeight / rowHeight));
            setPageSize(calculatedPageSize);
        }
    };

    useEffect(() => {
        calculatePageSize();
        window.addEventListener('resize', calculatePageSize);
        window.addEventListener('resize', updateHeights);
        return () => {
            window.removeEventListener('resize', calculatePageSize);
            window.removeEventListener('resize', updateHeights);
        };
    }, []);

    useEffect(() => {
        calculatePageSize();
    }, [data]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/call-record/all`);
            const users = response.data.map(user => ({
                value: user.fullName,
                phoneNumber: user.phoneNumber,
            }));
            const uniqueUsers = Array.from(
                new Map(users.map(user => [user.value.toLowerCase(), user])).values()
            );
            setNameOptions(uniqueUsers);
        } catch (error) {
            message.error('Kullanıcı verileri alınırken bir hata oluştu.');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            let response;
            switch (filterType) {
                case 'all':
                    response = await axios.get(`${BACKEND_URL}/call-record/all`);
                    break;
                case 'today':
                    response = await axios.get(`${BACKEND_URL}/call-record/today`);
                    break;
                case 'user':
                    if (!name.trim()) {
                        setLoading(false);
                        return;
                    }
                    response = await axios.get(`${BACKEND_URL}/call-record/user`, { params: { name } });
                    break;
                case 'range':
                    if (!dateRange[0] || !dateRange[1]) {
                        setLoading(false);
                        return;
                    }
                    response = await axios.get(`${BACKEND_URL}/call-record/range`, { params: { startDate: dateRange[0], endDate: dateRange[1] } });
                    break;
                default:
                    message.error('Geçersiz filtre türü');
                    setLoading(false);
                    return;
            }
            setData(response.data);
        } catch (error) {
            message.error('Veri çekilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filterType, name, dateRange]);

    const handleFilterChange = (newFilterType, newName, newDateRange) => {
        setFilterType(newFilterType);
        if (newName !== undefined) setName(newName);
        if (newDateRange !== undefined) setDateRange(newDateRange);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
    };

    const handleSave = () => {
        fetchData();
    };

    useEffect(() => {
        document.body.style.background = themeMode === 'light' ? '#fbfbfb' : '#181818';
        document.body.style.transition = 'background 0.2s';
    }, [themeMode]);

    const toggleTheme = () => {
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ConfigProvider theme={{ algorithm: themeMode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm }}>
            <Layout style={{ height: '100vh', overflow: 'hidden' }}>
                <div
                    style={{
                        backgroundColor: '#005',
                        color: 'white',
                        height: headerFooterHeight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 32px',
                    }}
                >
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <Typography.Title level={3} style={{ color: 'white', margin: 0 }}>
                            Arama Takip Sistemi
                        </Typography.Title>
                    </div>
                    <Button icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />} onClick={toggleTheme} />
                </div>
                <Layout.Content
                    ref={panelRef}
                    style={{
                        flexGrow: 1,
                        overflow: 'auto',
                        height: `calc(100vh - ${headerFooterHeight * 2}px)`,
                    }}
                >
                    <div style={{ display: 'flex', height: '100%' }}>
                        <div style={{ width: '30%' }}>
                            <InputPanel
                                nameOptions={nameOptions}
                                backendUrl={BACKEND_URL}
                                onSave={handleSave}
                                themeMode={themeMode}
                            />
                        </div>
                        <div style={{ flexGrow: 1 }}>
                            <Spin spinning={loading}>
                                <DisplayPanel
                                    nameOptions={nameOptions.map(user => ({ value: user.value }))}
                                    data={data}
                                    backendUrl={BACKEND_URL}
                                    filterType={filterType}
                                    onFilterChange={handleFilterChange}
                                    pageSize={pageSize}
                                    onPageSizeChange={handlePageSizeChange}
                                />
                            </Spin>
                        </div>
                    </div>
                </Layout.Content>
                <div
                    style={{
                        backgroundColor: '#005',
                        color: 'white',
                        height: headerFooterHeight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    Arama Takip Sistemi ©2025
                </div>
            </Layout>
        </ConfigProvider>
    );
};

export default AramaTakip;
