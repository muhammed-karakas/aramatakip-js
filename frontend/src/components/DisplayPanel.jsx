import React, { useState } from 'react';
import { AutoComplete, Button, ConfigProvider, DatePicker, Radio, Space, Table, Typography } from 'antd';
import tr from 'antd/lib/locale/tr_TR';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';

const normalizeString = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const DisplayPanel = ({ nameOptions, data, backendUrl, filterType, onFilterChange, pageSize, onPageSizeChange }) => {
    const [name, setName] = useState('');
    const [dateRange, setDateRange] = useState(undefined);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
        { title: 'Ad-Soyad', dataIndex: 'fullName', key: 'fullName', sorter: (a, b) => a.fullName.localeCompare(b.fullName) },
        { title: 'Telefon Numarası', dataIndex: 'phoneNumber', key: 'phoneNumber', sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber) },
        { title: 'Tarih-Saat', dataIndex: 'callDateTime', key: 'callDateTime', render: (text) => dayjs(text).format('DD.MM.YYYY HH:mm'), sorter: (a, b) => dayjs(a.callDateTime).unix() - dayjs(b.callDateTime).unix() },
        { title: 'Sorun Birime Ait Mi?', dataIndex: 'issueBelongsToUnit', key: 'issueBelongsToUnit', render: (val) => (val ? 'Evet' : 'Hayır'), sorter: (a, b) => Number(a.issueBelongsToUnit) - Number(b.issueBelongsToUnit) },
        { title: 'Gelmeyi Gerektirir Mi?', dataIndex: 'needsVisit', key: 'needsVisit', render: (val) => (val ? 'Evet' : 'Hayır'), sorter: (a, b) => Number(a.needsVisit) - Number(b.needsVisit) },
    ];

    const handleFilterChange = (newFilterType) => {
        setName('');
        setDateRange(undefined);
        onFilterChange(newFilterType);
    };

    const handleUserSelect = (value) => {
        setName(value);
        onFilterChange('user', value);
    };

    const handleRangeChange = (_, dateStrings) => {
        const formattedStartDate = dayjs(dateStrings[0], "DD.MM.YYYY").startOf('day').format("YYYY-MM-DDTHH:mm:ss");
        const formattedEndDate = dayjs(dateStrings[1], "DD.MM.YYYY").endOf('day').format("YYYY-MM-DDTHH:mm:ss");
        setDateRange([formattedStartDate, formattedEndDate]);
        onFilterChange('range', undefined, [formattedStartDate, formattedEndDate]);
    };

    const handleExcelDownload = () => {
        const url = new URL(`${backendUrl}/call-record/excel`);
        url.searchParams.append("reportType", filterType);
        if (filterType === "user" && name) {
            url.searchParams.append("name", normalizeString(name));
        }
        if (filterType === "range" && dateRange) {
            url.searchParams.append("startDate", dateRange[0]);
            url.searchParams.append("endDate", dateRange[1]);
        }
        window.location.href = url.toString();
    };

    return (
        <ConfigProvider locale={tr}>
            <div style={{ padding: '20px', height: '100%', boxSizing: 'border-box' }}>
                <Space wrap style={{ width: '100%', marginBottom: '16px' }}>
                    <Radio.Group value={filterType} onChange={(e) => handleFilterChange(e.target.value)}>
                        <Radio.Button value="all">Tüm Kayıtlar</Radio.Button>
                        <Radio.Button value="today">Bugünün Kayıtları</Radio.Button>
                        <Radio.Button value="user">Kullanıcıya Göre Filtrele</Radio.Button>
                        <Radio.Button value="range">Tarih Aralığına Göre Filtrele</Radio.Button>
                    </Radio.Group>
                    {filterType === 'user' && (
                        <AutoComplete
                            options={nameOptions}
                            onSelect={handleUserSelect}
                            placeholder="Kullanıcı Seçin"
                            style={{ minWidth: "200px", width: '100%' }}
                            allowClear
                            onClear={() => setName('')}
                            filterOption={(inputValue, option) =>
                                option ? option.value.toLowerCase().includes(inputValue.toLowerCase()) : false
                            }
                        />
                    )}
                    {filterType === 'range' && (
                        <DatePicker.RangePicker
                            format="DD.MM.YYYY"
                            onChange={handleRangeChange}
                            style={{ minWidth: "200px", width: '100%' }}
                        />
                    )}
                    <Button type="primary" onClick={handleExcelDownload}>
                        Excel Olarak İndir
                    </Button>
                    <Typography.Text style={{ display: 'block', marginLeft: '8px' }}>
                        Toplam {data.length} kayıt bulundu.
                    </Typography.Text>
                </Space>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        pageSize: pageSize,
                        showSizeChanger: true,
                        onShowSizeChange: (_, size) => onPageSizeChange(size),
                    }}
                    rowKey="id"
                />
            </div>
        </ConfigProvider>
    );
};

export default DisplayPanel;
