import React from 'react';
import axios from 'axios';
import { AutoComplete, Button, ConfigProvider, DatePicker, Form, message, Select } from 'antd';
import MaskedInput from 'antd-mask-input';
import tr from 'antd/lib/locale/tr_TR';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';

const InputPanel = ({ nameOptions, backendUrl, onSave, themeMode }) => {
    const [form] = Form.useForm();
    const boxColor = themeMode === 'light' ? '#ffffff' : '#141414';
    const textColor = themeMode === 'light' ? '#1f1f1f' : '#d9d9d9';
    const borderColor = themeMode === 'light' ? '#d9d9d9' : '#424242';

    const onNameSelect = (value) => {
        const selectedUser = nameOptions.find((user) => user.value === value);
        if (selectedUser) {
            const formattedPhoneNumber = selectedUser.phoneNumber.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '($1) $2 $3 $4');
            form.setFieldsValue({ phoneNumber: formattedPhoneNumber });
        }
    };

    const onFinish = async (values) => {
        const cleanedPhoneNumber = values.phoneNumber.replace(/\D/g, '');
        const formattedDateTime = dayjs(values.callDateTime).format("YYYY-MM-DDTHH:mm:ss");
        try {
            await axios.post(`${backendUrl}/call-record/create`, {
                ...values,
                phoneNumber: cleanedPhoneNumber,
                callDateTime: formattedDateTime,
            });
            message.success('Yeni arama kaydı başarıyla eklendi.');
            form.resetFields();
            onSave();
        } catch (error) {
            message.error('Kayıt eklenirken bir hata oluştu.');
        }
    };

    return (
        <ConfigProvider locale={tr}>
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ padding: '20px' }}>
                <Form.Item
                    name="fullName"
                    label="Ad-Soyad"
                    rules={[
                        { required: true, message: 'Ad-Soyad boş bırakılamaz.' },
                        {
                            pattern: /^(?=\S+(?: \S+){1,4}$)(?:(?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,} (?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,}|[A-ZÇĞİÖŞÜ]{2,}))|(?:(?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,} ){1,3}(?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,} (?:[A-ZÇĞİÖŞÜ][a-zçğıöşü]{1,}|[A-ZÇĞİÖŞÜ]{2,})|[A-ZÇĞİÖŞÜ]{2,} [A-ZÇĞİÖŞÜ]{2,})))$/,
                            message: 'Geçersiz Ad-Soyad biçimi.',
                        },
                    ]}
                >
                    <AutoComplete
                        options={nameOptions.map((user) => ({ value: user.value }))}
                        onSelect={onNameSelect}
                        placeholder="Ad-Soyad giriniz"
                        allowClear
                        onClear={() => form.setFieldsValue({ fullName: '', phoneNumber: '' })}
                        filterOption={(inputValue, option) =>
                            option ? option.value.toLowerCase().includes(inputValue.toLowerCase()) : false
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="phoneNumber"
                    label="Telefon Numarası"
                    rules={[
                        { required: true, message: 'Telefon numarası boş bırakılamaz.' },
                        { pattern: /^\(05\d{2}\) \d{3} \d{2} \d{2}$/, message: 'Geçersiz telefon numarası biçimi.' },
                    ]}
                >
                    <MaskedInput mask="({\05}00) 000 00 00" placeholder="(05XX) XXX XX XX" style={{ background: boxColor, color: textColor, borderColor: borderColor }} />
                </Form.Item>
                <Form.Item
                    name="callDateTime"
                    label="Tarih-Saat"
                    rules={[{ required: true, message: 'Tarih ve saat boş bırakılamaz.' }]}
                >
                    <DatePicker showTime={{ format: 'HH:mm' }} format="DD.MM.YYYY HH:mm" style={{ width: '100%' }} placeholder="Tarih-Saat seçiniz" />
                </Form.Item>
                <Form.Item
                    name="issueBelongsToUnit"
                    label="Sorun Birime Ait Mi?"
                    rules={[{ required: true, message: 'Bu alan boş bırakılamaz.' }]}
                >
                    <Select placeholder="Seçiniz">
                        <Select.Option value={true}>Evet</Select.Option>
                        <Select.Option value={false}>Hayır</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="needsVisit"
                    label="Gelmeyi Gerektirir Mi?"
                    rules={[{ required: true, message: 'Bu alan boş bırakılamaz.' }]}
                >
                    <Select placeholder="Seçiniz">
                        <Select.Option value={true}>Evet</Select.Option>
                        <Select.Option value={false}>Hayır</Select.Option>
                    </Select>
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Kaydet
                </Button>
            </Form>
        </ConfigProvider>
    );
};

export default InputPanel;
