from flask_wtf import FlaskForm
from wtforms import PasswordField, SelectField, StringField, SubmitField, TelField, TextAreaField
from wtforms.fields import EmailField
from wtforms.validators import DataRequired, Email, Length, Optional, ValidationError

from app.models import ACTIVITY_PLANS, PRODUCT_OPTIONS, RECORD_TYPES, STATUS_CHOICES
from app.phone_util import phone_digit_count


def _phone_digits_ok(_form, field):
    n = phone_digit_count(field.data)
    if n < 8 or n > 13:
        raise ValidationError("電話請填 8～13 位數字（可含 - 或空格）")


PHONE_VALIDATORS = [DataRequired(), Length(min=8, max=20), _phone_digits_ok]
PHONE_RENDER = {"maxlength": "20", "minlength": "8", "autocomplete": "tel"}


class InquiryForm(FlaskForm):
    """新增案件（活動／商品）。"""

    record_type = SelectField(
        "類型",
        choices=RECORD_TYPES,
        validators=[DataRequired()],
    )

    plan = SelectField(
        "活動方案",
        choices=[("", "請選擇方案")] + ACTIVITY_PLANS,
        validators=[Optional()],
    )

    product_name = SelectField(
        "商品",
        choices=[("", "請選擇商品")] + PRODUCT_OPTIONS,
        validators=[Optional()],
    )
    quantity = StringField("預計數量", validators=[Optional(), Length(max=80)])
    tax_id = StringField("統一編號", validators=[Optional(), Length(max=20)])
    need_invoice = SelectField(
        "是否需要發票",
        choices=[
            ("", "—"),
            ("要開統編發票", "要開統編發票"),
            ("不需發票", "不需發票"),
        ],
        validators=[Optional()],
    )
    delivery = SelectField(
        "配送方式",
        choices=[
            ("", "—"),
            ("宅配到府", "宅配到府"),
            ("集中配送", "集中配送"),
            ("到合作社自取", "到合作社自取"),
            ("Pinkoi 開賣後購買", "Pinkoi 開賣後購買（先留意向）"),
        ],
        validators=[Optional()],
    )

    org_name = StringField("單位名稱", validators=[Optional(), Length(max=200)])
    contact_name = StringField("聯絡人姓名", validators=[DataRequired(), Length(max=100)])
    email = EmailField("電子郵件", validators=[DataRequired(), Email(), Length(max=200)])
    phone = TelField("聯絡電話", validators=PHONE_VALIDATORS, render_kw=PHONE_RENDER)
    notes = TextAreaField("備註", validators=[Optional(), Length(max=500)])
    submit = SubmitField("建立案件")

    def validate(self, extra_validators=None):
        ok = super().validate(extra_validators=extra_validators)
        if not ok:
            return False
        if self.record_type.data == "activity":
            if not (self.plan.data or "").strip():
                self.plan.errors.append("請選擇活動方案")
                return False
            if not (self.org_name.data or "").strip():
                self.org_name.errors.append("請填單位名稱")
                return False
        elif self.record_type.data == "product":
            if not (self.product_name.data or "").strip():
                self.product_name.errors.append("請選擇商品")
                return False
            if not (self.quantity.data or "").strip():
                self.quantity.errors.append("請填預計數量")
                return False
        return True


class BookingEditForm(FlaskForm):
    """後台詳情：改內容與狀態。"""

    record_type = SelectField("類型", choices=RECORD_TYPES, validators=[DataRequired()])
    plan = SelectField(
        "活動方案",
        choices=[("", "—")] + ACTIVITY_PLANS,
        validators=[Optional()],
    )
    product_name = SelectField(
        "商品",
        choices=[("", "—")] + PRODUCT_OPTIONS,
        validators=[Optional()],
    )
    quantity = StringField("預計數量", validators=[Optional(), Length(max=80)])
    tax_id = StringField("統一編號", validators=[Optional(), Length(max=20)])
    need_invoice = SelectField(
        "是否需要發票",
        choices=[
            ("", "—"),
            ("要開統編發票", "要開統編發票"),
            ("不需發票", "不需發票"),
        ],
        validators=[Optional()],
    )
    delivery = SelectField(
        "配送方式",
        choices=[
            ("", "—"),
            ("宅配到府", "宅配到府"),
            ("集中配送", "集中配送"),
            ("到合作社自取", "到合作社自取"),
            ("Pinkoi 開賣後購買", "Pinkoi 開賣後購買（先留意向）"),
        ],
        validators=[Optional()],
    )
    org_name = StringField("單位名稱", validators=[Optional(), Length(max=200)])
    contact_name = StringField("聯絡人姓名", validators=[DataRequired(), Length(max=100)])
    email = EmailField("電子郵件", validators=[DataRequired(), Email(), Length(max=200)])
    phone = TelField("聯絡電話", validators=PHONE_VALIDATORS, render_kw=PHONE_RENDER)
    notes = TextAreaField("訪客備註", validators=[Optional(), Length(max=500)])
    status = SelectField("狀態", choices=STATUS_CHOICES, validators=[DataRequired()])
    admin_note = TextAreaField("內部備註", validators=[Optional(), Length(max=500)])
    submit = SubmitField("儲存")


class AdminLoginForm(FlaskForm):
    username = StringField("帳號", validators=[DataRequired()])
    password = PasswordField("密碼", validators=[DataRequired()])
    submit = SubmitField("登入")


class BookingStatusForm(FlaskForm):
    status = SelectField("狀態", choices=STATUS_CHOICES, validators=[DataRequired()])
    admin_note = TextAreaField("內部備註", validators=[Optional(), Length(max=500)])
    submit = SubmitField("儲存")
